/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 * @returns a Promise that should be filled with the response of the GET request
 * parsed as a JSON object and returned in the property named "data" of an
 * object. If the request has an error, the Promise should be rejected with an
 * object that contains the properties:
 * {number} status          The HTTP response status
 * {string} statusText      The statusText from the xhr request
 */

function fetchModel(url) {
  return new Promise(function (resolve, reject) {
    // Handler defined INSIDE — can see resolve and reject via closure
    function xhrHandler() {
      // Still loading — do nothing yet
      if (this.readyState !== 4) {
        return;
      }
      if (this.status !== 200) {
        //  pass plain object to reject, not new Error({})
        // return after reject so we don't fall through to resolve
        // reject({ status: this.status, statusText: this.statusText });

        const err = new Error();
        err.status = this.status;
        err.statusText = this.statusText;
        reject(err);
      }

      // Parse JSON and resolve the promise
      try {
        const data = JSON.parse(this.responseText);
        resolve({ data }); // ✅ { data } is shorthand for { data: data }
      } catch (e) {
        // Response arrived but JSON was malformed
        // reject({ status: this.status, statusText: "Invalid JSON response" });

        const err = new Error("Invalid JSON response");
        err.status = this.status;
        err.statusText = "Invalid JSON response";
        reject(err);
      }
    }

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = xhrHandler;
    xhr.open("GET", url);
    xhr.send();

    // console.log(url);
    // setTimeout(
    //   () => reject(new Error({ status: 501, statusText: "Not Implemented" })),
    //   0, // ← 0ms delay means "run immediately after this block"
    // );
    // ❌ This ALWAYS rejects the promise after 0ms
    // ❌ The XHR response (200ms later) calls resolve() too late
    // ❌ A Promise can only be settled once — first call wins
    // ❌ So the promise ALWAYS rejects with 501, even on success

    // On Success return:
    // resolve({data: getResponseObject});
  });
}

export default fetchModel;

/**
 * 
## 3. How does XHR pass the result back to fetchModel?

It doesn't "return" anything — it works through **events and closures**. Here's the timeline:
```
fetchModel("/user/1") called
│
├── new Promise created → resolve and reject born
│
├── xhr = new XMLHttpRequest() created
│
├── xhr.onreadystatechange = xhrHandler  ← register handler for later
│
├── xhr.send()  ← fires the HTTP request, returns immediately
│               (does NOT wait for response)
│
│   ... time passes, network request in flight ...
│
├── Browser receives response → fires onreadystatechange event
│
├── xhrHandler() runs automatically
│   ├── checks readyState == 4 (DONE)
│   ├── checks status == 200 (OK)
│   └── calls resolve({ data })  ← THIS is how result gets back
│                                   resolve() fulfills the Promise
│
└── .then(result => ...) runs in the caller with result.data


The key insight — xhr.send() does not block and wait. It fires the request and returns immediately. 
The result comes back later via the event callback which calls resolve().

 */
