import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Container } from 'reactstrap'

export const ScoreComponent = ({scores, solo}) => {
  // console.log('score: ', scores)
  function listColumns (name, score) {
    return (
      <Container>
        <Row style={{marginLeft: '0px'}}>
          <Col sm="8" style={{textAlign: 'right'}}>
            <h3>{solo ? 'Your score :' : name}</h3>
          </Col>
          <Col sm="2" style={{textAlign: 'right'}}>
            <h3>{score}</h3>
          </Col>
          <Col sm="2">
          </Col>
        </Row>
      </Container>
  )}
  
  function listRows (data) { 
    return (
      Object.keys(data).map( (key) =>  {
        let value = data[key];
        return (
          <Row key={key}>
            {listColumns(key, value)}
          </Row>
        )
    })
  )}

  return (
    <div style={{flexBasis: '33.33%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      {listRows(scores)}
    </ div>
  )
}

const mapStateToProps = (state) => {

  return {
    scores: state.game.scores || {},
    solo: state.room.solo
  }
}

export default connect(mapStateToProps, null)(ScoreComponent)