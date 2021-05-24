
function post(url, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        xhr.addEventListener('load', () => {
            let { response, status } = xhr;
            let res = JSON.parse(response);
            if(status >= 200 && status < 400){
                resolve({ response: res, status });
            } else{
                reject({ response: res , status });
            }
        });

        xhr.send(JSON.stringify(data));

    });

}

function post_s(url, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        if (isAuth) 
            xhr.setRequestHeader("Authorization", "Bearer "+getCookie('token'));

        xhr.addEventListener('load', () => {
            let { response, status } = xhr;
            let res = JSON.parse(response);

            //console.log("post_s(): status: "+status);

            if(status >= 200 && status < 400){
                resolve({ response: res, status });
            } else{
                reject({ response: res , status });
            }
        });

        xhr.send(JSON.stringify(data));

    });
}


function xhr(method, url, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        xhr.addEventListener('load', () => {
            let { response, status } = xhr;
            let res = JSON.parse(response);
            if(status >= 200 && status < 400){
                resolve({ response: res, status });
            } else{
                reject({ response: res , status });
            }
        });

        if(data){
            xhr.send(JSON.stringify(data));

        } else {
            xhr.send();
        }

    });

}

function xhr_s(method, url, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        if (isAuth) 
            xhr.setRequestHeader("Authorization", "Bearer "+getCookie('token'));

        xhr.addEventListener('load', () => {
            let { response, status } = xhr;
            let res = JSON.parse(response);

            if(status >= 200 && status < 400){
                resolve({ response: res, status });
            } else{
                reject({ response: res , status });
            }
        });

        if(data){
            xhr.send(JSON.stringify(data));

        } else {
            xhr.send();
        }

    });

}

async function fetchWithTimeout(resource, options) {
    const { timeout = 5000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
  
    return response;
}