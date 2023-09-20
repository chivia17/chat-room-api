import { startWS } from './boostrap';

startWS()
    .catch(error => {
        console.error(`Error at bootstrap: ${error}`);
    });
