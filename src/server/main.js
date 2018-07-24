import params  from '../../params';
import * as server from './index';
import Supervisor from './classes/Supervisor';

let supervisor = new Supervisor();

server.create(params.server, supervisor).then( () => console.log('not yet ready to play tetris with U ...') )
