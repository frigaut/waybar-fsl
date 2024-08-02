import { LibreLinkUpClient } from './client';
import * as fs from 'fs';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

(async function () {
  const username = 'frigaut@gmail.com';
  const password = 'D4TqINo`[tUY{h{%f"OC*Na{p';
  const libreClient = LibreLinkUpClient({
    username,
    password,
  });

  while (true) {
    const data = await libreClient.read();
    // var bg_value = data.current.value;
    // let bg_value: number = (Math.round(data.current.value * 10) / 10).toFixed(1);

    let trend: string = '?';
    let state: string = 'good';

    switch(data.current.trend) {
        case 'SingleDown':
          trend = '↓';
          state = 'warning';
          break;
        case 'FortyFiveDown':
          trend = '↘';
          break;
        case 'Flat':
          trend = '→';
          break;
        case 'FortyFiveUp':
          trend = '↗';
          break;
        case 'SingleUp':
          trend = '↑';
          state = 'warning';
          break;
        case 'NotComputable':
          trend = '?';
          break;
    };

    switch(true) {
        case (data.current.value < 3.9):
          state = 'critical';
          break;
        case (data.current.value > 10.0):
          state = 'critical';
          break;
        case (data.current.value < 4.4):
          state = 'warning';
          break;
        case (data.current.value > 8.0):
          state = 'warning';
          break;
    };

    let datesec: number = Date.parse(data.current.date.toLocaleString())/1000;

    // let result: string = `{ "bg":"${data.current.value} ${trend}", "state":"` + state +`"}`;
    // let result: string = `{"bg":${data.current.value}, "trend":"${trend}", "state":"` + state +`"}`;
    // let result: string = `{ "text":"${data.current.value} ${trend}", "class":"` + state +`"}`; // this works
    let result: string = `{ "text":"${data.current.value} ${trend}", "class":"` + state +`", "date":${datesec}}`;

    console.log(result);
    fs.writeFileSync('/tmp/bg.txt', result , 'utf-8');
    await delay(30000);

  }

})();

// date: 2024-08-02T11:08:34.000Z