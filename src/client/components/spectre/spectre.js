import React from 'react'
import { connect } from 'react-redux'
import { Row } from 'reactstrap'

const Spectre = ({ spectrum }) => {
  // function listColumns(name, score) {
  //   return (
  //     <div style={{ display: 'flex', flexDirection: 'row', flex: 2, justifyContent: 'space-around' }} >
  //       <div><h3>{name}</h3></div>
  //       <div><h3>{score}</h3></div>
  //     </div>
  //   )
  // };

  // function listRows(data) {
  //   return (
  //     Object.keys(data).map((key) => {
  //       let value = data[key];
  //       return (
  //         <Row key={key}>
  //           {listColumns(key, value)}
  //         </Row>
  //       )
  //     })
  //   )
  // };

  return (
    <div style={{ width: '80%' }}>
      {/* {console.log()} */}
    </ div>
  )
}

const mapStateToProps = (state) => {

  return {
    spectrum: state.game.spectrum,
  }
}

export default connect(mapStateToProps, null)(Spectre)