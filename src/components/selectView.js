//弹出选择器
import { Component } from 'react'

export default class SelectView extends Component {

  state = {

  }

  render() {
    const { dataSource, showAlert } = this.props
    return (
      <div>
        <div style={{
          display: showAlert ? 'flex' : 'none',
          position: 'absolute',
          zIndex: 10,
          width: '100vh',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          background:'red',
        }}
        >
          {/* 蒙板 */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: .5, background: 'lightGray' }} />
          {/* 内容 */}
          <div style={{
            position: 'absolute',
            width: '90vw',
            height: 230,
            borderRadius: 5,
            background: 'white',
            boxShadow: '0px 0px 5px #000'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}