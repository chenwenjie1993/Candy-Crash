import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import './Prize.scss'
import { prizeConfig } from './prizeConfig'
import logo from './images/logo.png'
import fb from './images/PrizeFB.png'
import shopping from './images/PrizeShopping.png'
import hotel from './images/PrizeHotel.png'
import pig from './images/PrizePig.jpg'
import hongbao1 from './images/PrizeHongbao1.png'
import hongbao2 from './images/PrizeHongbao2.png'
import hongbao3 from './images/PrizeHongbao3.png'
import SRL from './images/SRL.png'
import { BASE_URL } from './settings'

const prizeImage = {
  'A1': fb,
  'A2': fb,
  'B1': shopping,
  'B2': shopping,
  'B3': shopping,
  'C1': hotel,
  'C2': hotel,
  'D': pig,
  'E1': hongbao1,
  'E2': hongbao2,
  'E3': hongbao3,
}

function openCard (cardId) {

  axios.get(`${BASE_URL}/wechat/card/?card_id=${cardId}`)
    .then(resp => {
      console.log(resp)
      let cardExt = JSON.stringify(resp.data)
      window.wx.addCard({
          cardList: [
            {
              cardId,
              cardExt,
            }],
          success: function (res) {
          },
        },
      )
    })
}

function onCollect (prize) {
  const prizeType = prize.type
  const prizeDetail = prizeConfig[prizeType]
  if (prizeType === 'A2' || prizeType === 'B2' || prizeType === 'B3' ||
    prizeType === 'C2') {
    openCard(prizeDetail.code)
  }
  if (prizeType === 'C1') {
    window.location.replace(prizeDetail.code)
  }
  if (prizeType === 'E1' || prizeType === 'E2') {
    window.location.replace(prize.ref)
  }
  if (prizeType === 'B1') {
    window.location.replace(prizeDetail.code)
  }
}

function Prize ({ open, onClose, toggleShare, prize }) {
  const prizeType = prize.type
  if (!prizeType) return <div/>
  const prizeDetail = prizeConfig[prizeType]
  const details = prizeDetail.detail.split('\n')
  return (
    <div className={`overlay ${open ? 'open' : 'close'}`}>
      {
        prizeType !== 'E1' && prizeType !== 'E2' && prizeType !== 'E3' &&
        <div className='prize-container'>
          <div onClick={onClose} className='close-btn'>X</div>
          <div className="logo-container">
            <img src={logo} alt="" className="logo"/>
          </div>
          <div>
            <div className='prize-title'>{prizeDetail['title']}</div>
            <div className='prize-title2'>{prizeDetail['title2']}</div>
            <img src={prizeImage[prizeType]} alt='' className='prize-image'/>
            <div className='prize-detail-container'>
              {details.map(
                (d, idx) => d === 'SRL' ?
                  <div key={idx} className='SRL-container'>
                    <img src={SRL} className='SRL-img' alt=''/>
                  </div> :
                  <div className="prize-detail" key={idx}>{d ||
                  '\u00A0'}</div>)}
            </div>
          </div>
          {
            prizeType !== 'D' && prizeType !== 'A1' && prizeType !== 'B1' &&
            <div className='prize-btn'
                 onClick={() => onCollect(prize)}>立刻领取</div>
          }
          {
            prizeType === 'B1' &&
            <div className='prize-btn'
                 onClick={() => onCollect(prize)}>查看更多</div>
          }
          {
            (prizeType === 'A1' || prizeType === 'D') &&
            <div className='prize-btn' onClick={toggleShare}>分享再玩一次</div>
          }
        </div>
      }
      {
        (prizeType === 'E1' || prizeType === 'E2') &&
        <div className='prize-container hongbao-bg-2'>
          <div onClick={onClose} className='close-btn'>X</div>
          <div onClick={() => onCollect(prize)}
               style={{ height: '100%', width: '100%' }}/>
        </div>
      }
      {
        (prizeType === 'E3') &&
        <div className='prize-container hongbao-bg-1'>
          <div onClick={onClose} className='close-btn'>X</div>

        </div>
      }
    </div>
  )
}

Prize.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  toggleShare: PropTypes.func.isRequired,
  prize: PropTypes.object.isRequired,
}

export default Prize