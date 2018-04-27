import React from 'react'
import { filter } from 'ramda'
import styled from 'styled-components'
import OrderHistory from '../../OrderHistory'
import { Text } from 'blockchain-info-components'
import { determineStep, determineReason } from 'services/SfoxService'
import { flex } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import BuyCheckout from './BuyCheckout'
import { BuyOrderDetails, BuyOrderSubmit } from './BuyReviewOrder'

const CheckoutWrapper = styled.div`
  width: 50%;
`
const BuyOrderSubmitWrapper = CheckoutWrapper.extend`
  width: 35%;
  padding: 30px 30px 30px 10%;

`
const OrderHistoryWrapper = styled.div`
  width: 100%;
  > div:last-child > div:last-child {
    margin-bottom: 0px;
  }
`
const OrderHistoryContent = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  > div:last-child {
    margin-bottom: 20px;
  }
`

const isPending = (t) => t.state === 'processing'
const isCompleted = (t) => t.state !== 'processing'

const Success = props => {
  const {
    changeBuySellTabStatus,
    fetchQuote,
    fetchSellQuote,
    refreshQuote,
    submitQuote,
    submitSellQuote,
    handleTrade,
    quoteR,
    sellQuoteR,
    base,
    errors,
    showModal,
    handleTradeDetailsClick,
    ...rest } = props

  const accounts = Remote.of(props.value.accounts).getOrElse([])
  const profile = Remote.of(props.value.profile).getOrElse({ account: { verification_status: {} }, limits: { buy: 0, sell: 0 } })
  const verificationStatus = Remote.of(props.value.verificationStatus).getOrElse({ level: 'unverified', required_docs: [] })
  const payment = Remote.of(props.payment).getOrElse({ effectiveBalance: 0 })
  console.log('sfox content success:', payment)

  const { trades, type, busy } = rest
  const step = determineStep(profile, verificationStatus, accounts)
  const reason = determineReason(type, profile, verificationStatus, accounts)
  const finishAccountSetup = () => showModal('SfoxExchangeData', { step })

  const limits = {
    buy: {
      min: 10,
      max: profile.limits.buy
    },
    sell: {
      min: 10,
      max: profile.limits.sell,
      effectiveMax: payment && payment.effectiveBalance
    }
  }

  if (type === 'buy' || !type) {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <BuyCheckout
              quoteR={quoteR}
              account={accounts[0]}
              onFetchQuote={fetchQuote}
              reason={reason}
              finishAccountSetup={finishAccountSetup}
              limits={limits.buy}
              type={'buy'}
            />
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <div style={flex('row')}>
            <CheckoutWrapper>
              <BuyOrderDetails
                quoteR={quoteR}
                account={accounts[0]}
                onRefreshQuote={refreshQuote}
                type={'buy'}
              />
            </CheckoutWrapper>
            <BuyOrderSubmitWrapper style={{ ...flex('col') }}>
              <BuyOrderSubmit
                quoteR={quoteR}
                onSubmit={submitQuote}
                busy={busy}
              />
            </BuyOrderSubmitWrapper>
          </div>
        </StepView>
      </Stepper>
    )
  } else if (type === 'sell') {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <BuyCheckout
              quoteR={sellQuoteR}
              account={accounts[0]}
              onFetchQuote={fetchSellQuote}
              reason={reason}
              finishAccountSetup={finishAccountSetup}
              limits={limits.sell}
              type={'sell'}
            />
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <div style={flex('row')}>
            <CheckoutWrapper>
              <BuyOrderDetails
                quoteR={sellQuoteR}
                account={accounts[0]}
                onRefreshQuote={refreshQuote}
                type={'sell'}
              />
            </CheckoutWrapper>
            <BuyOrderSubmitWrapper style={{ ...flex('col') }}>
              <BuyOrderSubmit
                quoteR={sellQuoteR}
                onSubmit={submitSellQuote}
                busy={busy}
              />
            </BuyOrderSubmitWrapper>
          </div>
        </StepView>
      </Stepper>
    )
  } else if (trades) {
    return (
      <OrderHistoryWrapper>
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.sfoxcheckout.trades.pending' defaultMessage='Pending Orders' />
          </Text>
          <OrderHistory trades={filter(isPending, trades)} conversion={1e8} handleDetailsClick={trade => showModal('SfoxTradeDetails', { trade })} />
        </OrderHistoryContent>
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.sfoxcheckout.trades.completed' defaultMessage='Completed Orders' />
          </Text>
          <OrderHistory trades={filter(isCompleted, trades)} conversion={1e8} handleDetailsClick={trade => showModal('SfoxTradeDetails', { trade })} />
        </OrderHistoryContent>
      </OrderHistoryWrapper>
    )
  } else {
    return null
  }
}

export default Success
