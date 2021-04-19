export default class HttpAdapter {
	server = "http://api.repetit.ru/public"

	get(url) {
		url = this.server + url
		return fetch(url, {
			method: 'GET'
		})
	}
}

export function serialize(data) {
	return Object.keys(data).reduce(function(a,k){a.push(k+'='+encodeURIComponent(data[k]));return a},[]).join('&');
}