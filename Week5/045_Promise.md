## 프로미스

### 비동기 처리를 위한 콜백 패턴의 단점
```js
let g = 0;

setTimeout(() => { g = 100; }, 0);
console.log(g); // 0
```
- `setTimeout`함수는 비동기 함수다.
- 비동기 함수인 `setTimeout` 함수의 콜백 함수는 `setTimeout` 함수가 종료된 이후에 호출된다.
- 따라서 `setTimeout` 함수 내부의 콜백함수에서 처리 결과를 외부로 반환하거나 상위 스코프의 변수에 할당하면 기대한 대로 동작하지 않는다.

```js
const get = url => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send();

  xhr.onload = () => {
    if (xhr.status === 200) {
     return JSON.parse(xhr.response);
    } 
    console.error(`${xhr.status} ${xhr.statusText}`);
  };
};

const response = get('https://jsonplaceholder.typicode.com/posts/1');
console.log(response); // undefined
```
- `get` 함수는 반환문(return)이 없으므로 암묵적으로 `undefined`를 반환한다. 
- `onload` 이벤트 핸들러를 `get` 함수가 호출하지 않았기 때문에 `get` 함수는 `onload` 이벤트 핸들러의 반환값을 캐치할 수 없다.
- 그렇다면 서버의 응답을 상위 스코프의 변수에 할당하면 어떨까?
```js
let todos;

const get = url => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send();

  xhr.onload = () => {
    if (xhr.status === 200) {
      // 서버의 응답을 상위 스코프의 변수에 할당한다. 
      todos = JSON.parse(xhr.response);
    } else{
      console.error(`${xhr.status} ${xhr.statusText}`);
    }
  };
};

get('https://jsonplaceholder.typicode.com/posts/1');
console.log(todos); // undefined
```
- `onload` 이벤트 핸들러는 언제나 마지막 줄의 `console.log`가 종료된 이후에 호출된다.
- 따라서 `console.log`를 출력하는 시점에는 아직 전역 변수 `todos`에 서버의 응답이 할당되기 전이다.
- 이처럼 **비동기 함수는 비동기 처리 결과를 외부에 반환할 수 없고, 상위 스코프의 변수에 할당할 수도 없다.**
- 따라서 **비동기 함수의 처리결과(서버의 응답 등)에 대한 후속 처리는 비동기 함수 내부에서 수행해야 한다.**

**콜백 헬**
```js
const get = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        // 서버의 응답을 콜백 함수에 인수로 전달하면서 호출하여 응답에 대한 후속 처리를 한다. 
        callback(JSON.parse(xhr.response));
      } else{
        // 에러 정보를 콜백 함수에 인수로 전달하면서 호출하여 에러 처리를 한다.
        console.error(`${xhr.status} ${xhr.statusText}`);
      }
  };
};

const url = 'https://jsonplaceholder.typicode.com/posts/1'
get(`${url}/posts/1`, ({ userId }) => {
  console.log(userId); // 1
  // post의 userId를 사용하여 user 정보를 취득
  get(`${url}/users/${userId}`, userInfo => {
    console.log(userInfo); // {id: 1, name: "Leanne Graham", username: "Bret", ...}
  });
});
```
```js
get('/step1/', a => {
  get(`/step2/${a}`, b => {
    get(`/step3/${b}`, c => {
      get(`/step4/${c}`, d => {
        console.log(d);
      });
    });
  });
});
```
- 이처럼 비동기 함수가 비동기 처리 결과를 가지고 또다시 비동기 함수를 호출해야
한다면 콜백 함수 호출이 중첩되어 복잡도가 높아지는 현상이 발생하는데, 이를 **콜백 헬** 이라 한다.

#### 에러 처리의 한계
```js
try {
  setTimeout(() => {
    throw new Error('Error!');
  }, 1000)
} catch (e) {
  // 에러를 캐치하지 못한다.
  console.error('캐치한 에러', e);
}
```
- `setTimeout` 함수의 콜백 함수가 실행될 때 `setTimeout` 함수는 이미 콜 스택에서 제거된 상태다. (= 콜백 함수를 호출한 것은 `setTimeout`이 아니다.)
- 에러는 호출자 방향으로 전파된다. (= 실행 중인 실행 컨텍스트가 푸시되기 직전에 푸시된 실행 컨텍스트 방향으로 전파된다.)
- 따라서 `setTimeout` 함수의 콜백 함수가 발생시킨 에러는 `catch` 블록에서 캐치되지 않는다.
- 이렇듯 비동기 처리를 위한 콜백 패턴은 **에러 처리가 곤란하다**는 문제가 있다. 
- 이를 극복하기 위해 ES6에서 **프로미스** 가 도입되었다.

### 프로미스의 생성
```js
const promiseGet = url => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        // 성공적으로 응답을 전달받으면 resolve 함수를 호출한다.
        resolve(JSON.parse(xhr.response));
      } else{
        // 에러 처리를 위해 reject 함수를 호출한다.
        reject(new Error(xhr.status));
      }
    };
  });
};

promiseGet('https://jsonplaceholder.typicode.com/posts/1');
```
- `Promise` 생성자 함수가 인수로 전달받은 콜백 함수 내부에서 비동기 처리를 수행한다.
- 비동기 처리가 성공하면 콜백 함수의 인수로 전달받은 `resolve` 함수를 호출하고, 비동기 처리가 실패하면 `reject` 함수를 호출한다.

#### 프로미스의 진행 상태

프로미스의 상태 정보 | 의미 | 상태 변경 조건
--|--|--
pending | 비동기 처리가 아직 수행되지 않은 상태 | 프로미스가 생성된 직후 기본 상태
fulfiled | 비동기 처리가 수행된 상태(성공) | resolve 함수 호출
rejected | 비동기 처리가 수행된 상태(실패) | reject 함수 호출

### 프로미스의 후속 처리 메서드
#### Promise.prototype.then
```js
// fulfiled
new Promise(resolve => resolve('fulfiled'))
  .then(v => console.log(v), e => console.error(e)); // fulfiled

// rejected
new Promise((_, reject) => reject(new Error('rejected')))
  .then(v => console.log(v), e => console.error(e)); // Error: rejected
```
- `then` 메서드는 두 개의 콜백 함수를 인수로 전달 받는다.
  1. 프로미스가 `fulfiled` 상태가 되면 호출할 콜백 함수
  2. 프로미스가 `rejected` 상태가 되면 호출할 콜백 함수
- `then` 메서드는 언제나 프로미스를 반환한다.

#### Promise.prototype.catch
```js
// rejected
new Promise((_, reject) => reject(new Error('rejected')))
  .catch(e => console.error(e)); // Error: rejected
```
- `catch` 메서드는 프로미스가 `rejected` 상태인 경우에 호출할 콜백 함수를 인수로 전달받는다.

#### Promise.prototype.finally
```js
new Promise(() => {})
  .finally(() => console.log('finally')); // finally
```
- `finally` 메서드의 콜백 함수는 프로미스의 성공 여부와 상관없이 무조건 한 번 호출 된다.

### 프로미스의 에러 처리
```js
const wrongUrl = 'https://jsonplaceholder.typicode.com/XXX/1';

const promiseGet = url => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        // 성공적으로 응답을 전달받으면 resolve 함수를 호출한다.
        resolve(JSON.parse(xhr.response));
      } else{
        // 에러 처리를 위해 reject 함수를 호출한다.
        reject(new Error(xhr.status));
      }
    };
  });
};

promiseGet(wrongUrl).then(
  res => console.log(res),
  err => console.error(err)
); // Error: 404

promiseGet(wrongUrl)
  .then(res => console.log(res))
  .catch(err => console.error(err)); // Error: 404
```
- `then` 메서드의 두 번째 콜백 함수는 첫 번째 콜백 함수에서 발생한 에러를 캐치하지 못하고 가독성이 좋지 않다.
- `catch` 메서드를 모든 `then` 메서드를 호출한 이후에 호출하면 비동기 처리에서 발생한 에러 뿐만 아니라 `then` 메서드 내부에서 발생한 에러까지 모두 캐치할 수 있다.
- 따라서 에러 처리는 `catch` 메서드에서 하는 것을 권장한다.

### 프로미스 체이닝
```js
const url = 'https://jsonplaceholder.typicode.com';

promiseGet(`${url}/posts/1`)
  .then(({ userId }) => promiseGet(`${url}/users/${userId}`))
  .then(userInfo => console.log(userInfo))
  .catch(err => console.error(err));
```
- `then`, `catch`, `finally` 후속 처리 메서드는 언제나 프로미스를 반환하므로 연속적으로 호출할 수 있다. 
- 이를 **프로미스 체이닝**이라 한다.
- 만약 후속 처리 메서드의 콜백 함수가 프로미스가 아닌 값을 반환하더라도 그 값을 암묵적으로 `resolve` 또는 `reject`하여 프로미스를 생성해 반환한다.
- ES8에서 도입된 `async/await`를 사용하면 프로미스의 후속 처리 메서드 없이 마치 동기 처리처럼 프로미스가 처리 결과를 반환하도록 구현할 수 있다.

### 프로미스의 정적 메서드
#### Promise.resolve / Promise.reject
```js
const resolvedPromise = Promise.resolve([1, 2, 3]);
resolvedPromise.then(console.log); // [1, 2, 3]
// resolvePromise.then(v => console.log(v));

const resolvedPromise = new Promise(resolve => resolve([1, 2, 3]));
resolvedPromise.then(console.log);


const rejectedPromise = Promise.reject(new Error('Error!'));
rejectedPromise.catch(console.log); // Error: Error!

const rejectedPromise = new Promise((_, reject) => new Error('Error!'));
resolvedPromise.catch(console.log);
```
- `Promise.resolve` 메서드는 인수로 전달받은 값을 resolve하는 프로미스를 생성한다.
- `Promise.reject` 메서드는 인수로 전달받은 값을 reject하는 프로미스를 생성한다.

#### Promise.all
- 여러 개의 비동기 처리를 모두 병렬 처리할 때 사용한다.
- 인수로 받은 배열의 모든 프로미스가 fulfiled 상태가 되면 종료한다.
```js
const requestData1 = () => 
  new Promise(resolve => setTimeout(() => resolve(1), 3000));
const requestData2 = () => 
  new Promise(resolve => setTimeout(() => resolve(2), 2000));
const requestData3 = () => 
  new Promise(resolve => setTimeout(() => resolve(3), 1000));

const res = [];
requestData1().then(data => {
  res.push(data);
  return requestData2();
}).then(data => {
  res.push(data);
  return requestData3();
}).then(data => {
  res.push(data);
  console.log(res); // [1, 2, 3], 약 6초
}).catch(console.error);
```
- 세 개의 비동기 처리는 순차적으로 처리된다. 
- 그런데 세 개 의 비동기 처리는 앞선 비동기 처리 결과를 다음 비동기 처리가 사용하지 않으므로 순차적으로 처리할 필요가 없다.
- `Promise.all`을 사용해 병렬 처리해보자.
```js
const requestData1 = () => 
  new Promise(resolve => setTimeout(() => resolve(1), 3000));
const requestData2 = () => 
  new Promise(resolve => setTimeout(() => resolve(2), 2000));
const requestData3 = () => 
  new Promise(resolve => setTimeout(() => resolve(3), 1000));

Promise.all([requestData1(), requestData2(), requestData3()])
  .then(console.log) // [ 1, 2, 3 ], 약 3초
  .catch(console.error)
```
- 첫 번째 프로미스는 3초 후에 1을 resolve한다.
- 두 번째 프로미스는 2초 후에 2을 resolve한다.
- 세 번째 프로미스는 1초 후에 3을 resolve한다.
- 이 때 첫 번째 프로미스가 가장 나중에 fulfiled 상태가 되어도 `Promise.all` 메서드는 첫 번째 프로미스가 resolve한 처리 결과부터 차례대로 배열에 저장해 그 배열을 resolve하는 새로운 프로미스를 반환한다. (처리 순서 보장.)
- 인수로 전달받은 배열의 프로미스가 하나라도 rejected 상태가 되면 프로미스가 fulfiled 상태가 되는 것을 기다리지 않고 즉시 종료한다.
```js
Promise.all([
  1, // -> Promise.resolve(1)
  2, // -> Promise.resolve(2)
  3, // -> Promise.resolve(3)
])
  .then(console.log) // [ 1, 2, 3 ]
  .catch(console.error)
```
- 인수로 전달받은 이터러블의 요소가 프로미스가 아닌 경우 `Promise.resolve`메서드를 통해 프로미스로 래핑한다.

#### Promise.race
- 모든 프로미스가 fulfiled 상태가 되는 것을 기다리지 않고 가장 먼저 fulfiled 상태가 된 프로미스의 처리 결과를 resolve하는 새로운 프로미스를 반환한다.
```js
Promise.race([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
  new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
  new Promise(resolve => setTimeout(() => resolve(3), 1000)), // 3
])
  .then(console.log) // 3
  .catch(console.error);
```
- 인수로 전달받은 배열의 프로미스가 하나라도 rejected 상태가 되면 에러를 reject하는 새로운 프로미스를 즉시 반환한다.

#### Promise.allSettled
- 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달받는다.
- 전달받은 프로미스가 모두 `settled` 상태(fulfiled 또는 rejected상태)가 되면 처리 결과를 배열로 반환한다.
```js
Promise.allSettled([
  new Promise(resolve => setTimeout(() => resolve(1), 2000)),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Error!')), 1000))
]).then(console.log);
/*
0: {status: 'fulfilled', value: 1}
1: {status: 'rejected', reason: Error: Error! at <anonymous>:3:54}*/
```

### 마이크로태스크 큐
```js
setTimeout(() => console.log(1), 0);

Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3));
```
- 위의 예제는 예상과 다르게 2 -> 3 -> 1 순으로 출력된다.
- 왜? 프로미스의 후속 처리 메서드(then)의 콜백 함수는 태스크 큐가 아니라 **마이크로태스크 큐**에 저장되기 떄문.
- **마이크로태스크 큐는 태스크 큐보다 우선순위가 높아** 콜 스택이 비면 먼저 마이크로태스크 큐에서 대기하고 있는 함수를 가져와 실행하고 마이크로태스크 큐까지 비면 태스크 큐에서 대기하는 함수를 실행한다.
- 마이크로태스크 큐에는 프로미스의 후속 처리 메서드의 콜백 함수가 일지 저장되며 그 외 비동기 함수의 콜백 함수나 이벤트 핸들러는 태스크 큐에 일시 저장된다.

### fetch
- `fetch` 함수는 `XMLHttpRequest` 객체와 마찬가지로 HTTP 요청 전송 기능을 제공하는 클라이언트 사이드 Web API 이다.
- 프로미스를 지원하기 때문에 비동기 처리를 위한 콜백 패턴의 단점에서 자유롭다.

```js
const promise = fetch(url, [, options])
```
- `fetch` 함수는 HTTP 응답을 나타내는 `Response` 객체를 래핑한 `Promise` 객체를 반환한다.

```js
fetch('https://jsonplaceholder.typicode.com/todos/1')
  // response는 HTTP 응답을 나타내는 Response 객체다.
  // json 메서드를 사용하여 Response 객체에서 HTTP 응답 몸체를 취득하여 역직렬화한다.
  .then(response => response.json())
  // json은 역직렬화된 HTTP 응답 몸체다.
  .then(json => console.log(json));

// {userId: 1, id: 1, title: 'delectus aut autem', completed: false}
```
- `fetch` 함수에 첫 번째 인수로 HTTP 요청을 전송할 URL과 두 번째 인수로 HTTP 요청 메서드, HTTP 요청 헤더, 페이로드 등을 설정한 객체를 전달하여 HTTP 요청을 전송 할 수 있다.

```js
const request = {
  get(url) {
    return fetch(url);
  },
  post(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  patch(url, payload) {
    return fetch(url, {
      method: 'PATCH',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  delete(url) {
    return fetch(url, { method: 'DELETE' });
  }
};

const url = 'https://jsonplaceholder.typicode.com/todos';
// GET 요청
request.get(`${url}/1`)
  .then(res => res.json())
  .then(console.log);
// {userId: 1, id: 1, title: 'delectus aut autem', completed: false}


// POST 요청
request.post(url, {
  userId: 1,
  title: 'JavaScript',
  completed: false
}).then(res => res.json())
  .then(console.log)
  .catch(console.error);
// {userId: 1, title: 'JavaScript', completed: false, id: 201}  

// PATCH 요청
request.patch(`${url}/1`, {
  completed: true
}).then(res => res.json())
  .then(console.log)
  .catch(console.error);
// {userId: 1, id: 1, title: 'delectus aut autem', completed: true}

// DELETE 요청
request.delete(`${url}/1`)
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
// {}
```
- 더 자세한 내용은 [MDN Using Fetch](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch)를 참고하자.
