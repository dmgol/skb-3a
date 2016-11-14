import express from 'express';
import cors from 'cors';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';


const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
let pc = {};
fetch(pcUrl)
  .then(async (res) => {
    pc = await res.json();
  })
  .catch(err => console.log('Error:', err));


const app = express();
app.use(cors());

function getParams(object, ...props) {
  let result = object;
  let isArray = false;
  for (const p of props) {
    if (p === undefined) break;
    if (isArray && p === 'length') return undefined;
    result = result[p];
    console.log(JSON.stringify(result));
    if (!result) break;
    isArray = _.isArrayLike(result);
  }
  return result;
}

function notFound(res) {
  res.status(404).send('Not Found');
}

app.get('/task3A/:p1?/:p2?/:p3?', (req, res) => {
  console.log(req.params);

  const p1 = req.params.p1;
  const p2 = req.params.p2;
  const p3 = req.params.p3;

  const volumes = {};
  if (req.params.p1 === 'volumes') {
    pc.hdd.forEach((i) => {
      volumes[i.volume] = volumes[i.volume] || 0;
      volumes[i.volume] += i.size;
    });
    res.json(_.mapValues(volumes, v => `${v}B`));
  }
  const r = getParams(pc, p1, p2, p3);
  if (r !== undefined) res.json(r);
  else notFound(res);
});

app.listen(3000, () => {
  console.log('Ready!');
});
