import React from 'react'
import { connect } from 'react-redux'
import { sendMessage } from '../../actions/chat'
import { Container, Form, FormGroup, Col, Input, Row, Button } from 'reactstrap'
import { getSocket } from '../../actions/socket';

const Chat = ({ messages, message, socket }) => {
  function listMessages(data) {
    return (
      messages.map((m, index) => {
        return (
          <Row key={index}>
            <h3>{m}</h3>
          </Row>
        )
      })
    )
  };

	function send(message) {
    sendMessage(message, socket);
    document.getElementById("messageInput").value = ''
  }

	function handleChange(e) {
		message = e.target.value;
	}

  return (
		<Container>
      <div style={{flexBasis: '33.33%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {listMessages(messages)}
      </ div>
      <Row className="justify-content-center">
        <Form>
          <FormGroup row>
            <Col sm={8}>
              <Input value={message} onChange={handleChange} type="text" name="message" id="messageInput" placeholder="..." bsSize="lg" />
            </Col>
            <Button color="primary" size="lg" onClick={() => {send(message)}}>Send!</Button>{' '}
          </FormGroup>
        </Form>
      </Row>  
    </ Container>
)
}

const mapStateToProps = (state) => {
  console.log('state: ', state);
  return {
    messages: state.room.messages || [],
    message: undefined,
    socket: getSocket(state)
  }
}

export default connect(mapStateToProps, null)(Chat)