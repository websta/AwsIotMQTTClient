import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import SenderButton from './SenderButton'
import MessageList from './MessageList'
import CommentForm from './CommentForm'
import AWSMqtt from 'aws-mqtt-client'
import * as Config from './config.js'






class App extends Component {
  constructor(props) {
    super(props);
    this.publishMessage = this.publishMessage.bind(this);
  }

  initMQTT() {
    const mqttClient = new AWSMqtt({
      accessKeyId: Config.AWS_ACCESS_KEY,
      secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
      // sessionToken: Config.AWS_SESSION_TOKEN,
      endpointAddress: Config.AWS_IOT_ENDPOINT_HOST,
      region: Config.AWS_REGION
    });

    mqttClient.on('connect', () => {
      mqttClient.subscribe(Config.AWS_IOT_TOPIC);
      console.log('connected to iot mqtt websocket');
    });

    mqttClient.on('message', (topic, message) => {
      console.log('message retrieved: ', JSON.parse(message));
      this.setState({messages: [...this.state.messages, JSON.parse(message)] });
    });


    return mqttClient;
  }


  componentWillMount() {
    let messages = Array();
    messages.push('hello world');
    const mqttClient = this.initMQTT();

    this.setState({ mqttClient: mqttClient, messages: messages });

  }

   publishMessage(data) {
        console.log('Button was clicked!');
        this.state.mqttClient.publish(Config.AWS_IOT_TOPIC, JSON.stringify({ key: Date.now(),  value: data}));
    }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Serverless Vienna</h2>
        </div>
        <MessageList list={this.state.messages} />
        {/*<SenderButton publishMessage={this.publishMessage}/>*/}
        <CommentForm publishMessage={this.publishMessage}/>
        
      </div>
    );
  }
}

export default App;
