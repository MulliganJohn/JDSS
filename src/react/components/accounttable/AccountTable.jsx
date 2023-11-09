import React from 'react'
import './accounttable.css'


const AccountTable = ({ data }) => {

  return (
    <div className='JDSS_AccountTable'>
      <table>
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Ingame Name</th>
            <th>Region</th>
            <th>Level</th>
            <th>RP</th>
            <th>BE</th>
          </tr>
        </thead>
        <tbody>
          {data.map((account) => (
            <tr key={account.accountID}>
              <td>{account.accountID}</td>
              <td>{account.game_name}</td>
              <td>{account.region}</td>
              <td>{account.summonerLevel}</td>
              <td>{account.rp}</td>
              <td>{account.ip}</td>
            </tr>
          ))}
          <tr style={{ height: '100%' }}></tr>
        </tbody>
      </table>
    </div>
  )
}

export default AccountTable