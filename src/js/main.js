import axios from "axios";
const dataEl = document.getElementById('data');
const statusEl = document.getElementById('status');
const configEl = document.getElementById('config');
const headersEl = document.getElementById('headers');

axios.interceptors.request.use(function (config) {
	config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
	config.headers['Content-Type'] = 'application/json';
	return config;
}, function (error) {
	return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
	return response;
}, function (error) {
	return Promise.reject(error);
});

const get = () => {
	const config = {
		params: {
			_limit: 2
		}
	};
	axios.get('https://jsonplaceholder.typicode.com/posts', config)
	.then((response) => 	renderOutput(response));
};

const post = () => {
  const data = {
    userId: 1,
    body: 'Teste axios',
		title: 'Metodo POST',
	};
	axios.post('https://jsonplaceholder.typicode.com/posts', data)
		.then((response) => 	renderOutput(response));
}

const put = () => {
	const data = {
		userId: 1,
		body: 'Teste axios',
		title: 'Metodo PUT',
	};
	axios.put('https://jsonplaceholder.typicode.com/posts/1', data)
		.then((response) => renderOutput(response));
}

const patch = () => {
		const data = {
			title: 'Metodo PATCH',
		}
		axios.patch('https://jsonplaceholder.typicode.com/posts/1', data)
		.then((response) => renderOutput(response));
}

const del = () => {
		const data = {
			id: 2,
		}
		axios.delete(`https://jsonplaceholder.typicode.com/posts/${data.id}`)
		.then((response) => renderOutput(response));
}

const multiple = () => {
    console.log('multiple');
}

const transform = () => {
		const config = {
			params: {
				_limit: 2
			},
			transformResponse: [function (data) {
				const payload = JSON.parse(data).map(itm => {
					return {
						title: itm.title,
						is_selected: false
					}
				});
				return payload;
			}],
		}
		axios.get('https://jsonplaceholder.typicode.com/posts', config)
		.then((response) => 	renderOutput(response));
}

const errorHandling = () => {
	axios.get('https://jsonplaceholder.typicode.com/posts,')
		.then((response) => renderOutput(response))
		.catch((error) => {
			renderOutput(error.toJSON());
		})
}

const cancel = () => {
	const controller = new AbortController();
	const signal = controller.signal;
    const config = {
			params: {
				_limit: 2
			},
			signal
		}
		axios.get('https://jsonplaceholder.typicode.com/posts', config)
		.then((response) => 	renderOutput(response))
		.catch((error) => {
			console.log(error.message);
		})
		controller.abort();
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('put').addEventListener('click', put);
document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('clear').addEventListener('click', clear);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('transform').addEventListener('click', transform);