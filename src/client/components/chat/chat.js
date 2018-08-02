import React from 'react'
import { connect } from 'react-redux'
import { sendMessage } from '../../actions/chat'
import { Container, Form, FormGroup, Col, Input, Row, Button, InputGroup, InputGroupAddon } from 'reactstrap'
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
  
  const onKeyPress = (event) => {
		if (event.which === 13 /* Enter */) {
      event.preventDefault();
      if (message != undefined)
        send(message)
		}
	}

  return (
		<Container style={{ marginBottom: '4%' }}>
      <Row style={{maxHeight: '167px', overflow: 'hidden', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
        <Container>
          {listMessages(messages)}
        </ Container>
      </Row>  
      <Row className="justify-content-center">
        <Form onKeyPress={onKeyPress} style={{ width: '100%' }}>
          <InputGroup>
            <Input value={message} onChange={handleChange} type="text" name="message" id="messageInput" placeholder="..." bsSize="lg" />
            <InputGroupAddon addonType="append">
              <Button color="primary" size="lg" onClick={() => {send(message)}}>Send!</Button>
            </InputGroupAddon>
          </InputGroup>
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