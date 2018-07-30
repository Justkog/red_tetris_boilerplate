import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Container } from 'reactstrap'

const Score = ({scores}) => {
    console.log('score: ', scores)
    function listColumns (name, score) {
      return (
        <Container>
          <Row style={{marginLeft: '0px'}}>
            <Col>
              <h3>{name}</h3>
            </Col>
            <Col>
              <h3>{score}</h3>
            </Col>
          </Row>
        </Container>
    )};
  
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
)} ;

  return (
    <div style={{flexBasis: '33.33%'}}>
      {listRows(scores)}
    </ div>
  )
}

const mapStateToProps = (state) => {

  return {
    scores: state.game.scores || {},
  }
}

export default connect(mapStateToProps, null)(Score)