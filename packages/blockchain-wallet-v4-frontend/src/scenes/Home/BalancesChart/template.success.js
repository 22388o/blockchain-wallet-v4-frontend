import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { FormattedMessage } from 'react-intl'
import { Color, Text } from 'blockchain-info-components'
import configure from './chart.config.js'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const Wrapper = styled.div`
  width: 100%;
  height: 370px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
  border: 1px solid ${props => props.theme['gray-1']};
`
const ChartInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  > * { margin-bottom: 4px; }
`
const ColourBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${props => props.color};
`
const CoinBalance = styled.div`
  cursor: pointer;
  font-size: 14px;
`

const BalancesChart = (props) => {
  const { balances, handleCoinDisplay } = props
  const { bitcoinBalance, etherBalance, bchBalance, chartData, symbol } = balances

  return (
    <Wrapper>
      <Text uppercase color='brand-primary' weight={300} size='24px'>
        <FormattedMessage id='scenes.home.balanceschart.yourbalances' defaultMessage='Your Balances' />
      </Text>
      <ReactHighcharts config={configure(chartData, symbol)} isPureConfig />
      <ChartInfo>
        <Column>
          <ColourBar color={Color('brand-primary')} />
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.home.balanceschart.btc' defaultMessage='Bitcoin' />
          </Text>
          <CoinBalance onClick={handleCoinDisplay}>
            <SwitchableDisplay coin='BTC' size='14px' weight={200}>{bitcoinBalance}</SwitchableDisplay>
          </CoinBalance>
        </Column>
        <Column>
          <ColourBar color={Color('brand-secondary')} />
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.home.balanceschart.eth' defaultMessage='Ether' />
          </Text>
          <CoinBalance onClick={handleCoinDisplay}>
            <SwitchableDisplay coin='ETH' size='14px' weight={200}>{etherBalance}</SwitchableDisplay>
          </CoinBalance>
        </Column>
        <Column>
          <ColourBar color={Color('brand-tertiary')} />
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.home.balanceschart.bch' defaultMessage='Bitcoin Cash' />
          </Text>
          <CoinBalance onClick={handleCoinDisplay}>
            <SwitchableDisplay coin='BCH' size='14px' weight={200}>{bchBalance}</SwitchableDisplay>
          </CoinBalance>
        </Column>
      </ChartInfo>
    </Wrapper>
  )
}

export default BalancesChart
