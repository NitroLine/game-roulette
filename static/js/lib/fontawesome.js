window.FontAwesomeKitConfig = {
	asyncLoading: {enabled: false}, autoA11y: {enabled: true}, baseUrl: 'https://ka-f.fontawesome.com', baseUrlKit: 'https://kit.fontawesome.com', detectConflictsUntil: null, iconUploads: {}, id: 6337307, license: 'free', method: 'css', minify: {enabled: true}, token: 'd1722654fc', v4FontFaceShim: {enabled: true}, v4shim: {enabled: true}, v5FontFaceShim: {enabled: false}, version: '5.15.4',
};
!(function (t) {
	typeof define === 'function' && define.amd ? define('kit-loader', t) : t();
})(() => {
	function t(e) {
		return (t = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (t) {
			return typeof t;
		} : function (t) {
			return t && typeof Symbol === 'function' && t.constructor === Symbol && t !== Symbol.prototype ? 'symbol' : typeof t;
		})(e);
	}

	function e(t, e, n) {
		return e in t ? Object.defineProperty(t, e, {
			value: n, enumerable: !0, configurable: !0, writable: !0,
		}) : t[e] = n, t;
	}

	function n(t, e) {
		const n = Object.keys(t); if (Object.getOwnPropertySymbols) {
			let o = Object.getOwnPropertySymbols(t); e && (o = o.filter(e => Object.getOwnPropertyDescriptor(t, e).enumerable)), n.push.apply(n, o);
		}

		return n;
	}

	function o(t) {
		for (let o = 1; o < arguments.length; o++) {
			var r = arguments[o] != null ? arguments[o] : {}; o % 2 ? n(Object(r), !0).forEach(n => {
				e(t, n, r[n]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach(e => {
				Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
			});
		}

		return t;
	}

	function r(t, e) {
		return (function (t) {
			if (Array.isArray(t)) {
				return t;
			}
		})(t) || (function (t, e) {
			if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(t))) {
				return;
			}

			const n = []; let o = !0; let r = !1; let i = void 0; try {
				for (var c, a = t[Symbol.iterator](); !(o = (c = a.next()).done) && (n.push(c.value), !e || n.length !== e); o = !0) {

				}
			} catch (t) {
				r = !0, i = t;
			} finally {
				try {
					o || a.return == null || a.return();
				} finally {
					if (r) {
						throw i;
					}
				}
			}

			return n;
		})(t, e) || (function (t, e) {
			if (!t) {
				return;
			}

			if (typeof t === 'string') {
				return i(t, e);
			}

			let n = Object.prototype.toString.call(t).slice(8, -1); n === 'Object' && t.constructor && (n = t.constructor.name); if (n === 'Map' || n === 'Set') {
				return Array.from(t);
			}

			if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
				return i(t, e);
			}
		})(t, e) || (function () {
			throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
		})();
	}

	function i(t, e) {
		(e == null || e > t.length) && (e = t.length); for (var n = 0, o = new Array(e); n < e; n++) {
			o[n] = t[n];
		}

		return o;
	}

	function c(t, e) {
		const n = e && e.addOn || ''; const o = e && e.baseFilename || t.license + n; const r = e && e.minify ? '.min' : ''; const i = e && e.fileSuffix || t.method; const c = e && e.subdir || t.method; return `${t.baseUrl}/releases/${t.version === 'latest' ? 'latest' : 'v'.concat(t.version)}/${c}/${o}${r}.${i}`;
	}

	function a(t) {
		return `${t.baseUrlKit}/${t.token}/${t.id}/kit-upload.css`;
	}

	function u(t, e) {
		const n = e || ['fa']; const o = `.${Array.prototype.join.call(n, ',.')}`; const r = t.querySelectorAll(o); Array.prototype.forEach.call(r, e => {
			const n = e.getAttribute('title'); e.setAttribute('aria-hidden', 'true'); const o = !e.nextElementSibling || !e.nextElementSibling.classList.contains('sr-only'); if (n && o) {
				const r = t.createElement('span'); r.innerHTML = n, r.classList.add('sr-only'), e.parentNode.insertBefore(r, e.nextSibling);
			}
		});
	}

	let f; const s = function () {}; const d = typeof global !== 'undefined' && void 0 !== global.process && typeof global.process.emit === 'function'; const l = typeof setImmediate === 'undefined' ? setTimeout : setImmediate; let h = []; function m() {
		for (let t = 0; t < h.length; t++) {
			h[t][0](h[t][1]);
		}

		h = [], f = !1;
	}

	function p(t, e) {
		h.push([t, e]), f || (f = !0, l(m, 0));
	}

	function v(t) {
		const e = t.owner; let n = e._state; let o = e._data; const r = t[n]; const i = t.then; if (typeof r === 'function') {
			n = 'fulfilled'; try {
				o = r(o);
			} catch (t) {
				w(i, t);
			}
		}

		y(i, o) || (n === 'fulfilled' && b(i, o), n === 'rejected' && w(i, o));
	}

	function y(e, n) {
		let o; try {
			if (e === n) {
				throw new TypeError('A promises callback cannot return that same promise.');
			}

			if (n && (typeof n === 'function' || t(n) === 'object')) {
				const r = n.then; if (typeof r === 'function') {
					return r.call(n, t => {
						o || (o = !0, n === t ? g(e, t) : b(e, t));
					}, t => {
						o || (o = !0, w(e, t));
					}), !0;
				}
			}
		} catch (t) {
			return o || w(e, t), !0;
		}

		return !1;
	}

	function b(t, e) {
		t !== e && y(t, e) || g(t, e);
	}

	function g(t, e) {
		t._state === 'pending' && (t._state = 'settled', t._data = e, p(S, t));
	}

	function w(t, e) {
		t._state === 'pending' && (t._state = 'settled', t._data = e, p(O, t));
	}

	function A(t) {
		t._then = t._then.forEach(v);
	}

	function S(t) {
		t._state = 'fulfilled', A(t);
	}

	function O(t) {
		t._state = 'rejected', A(t), !t._handled && d && global.process.emit('unhandledRejection', t._data, t);
	}

	function j(t) {
		global.process.emit('rejectionHandled', t);
	}

	function E(t) {
		if (typeof t !== 'function') {
			throw new TypeError(`Promise resolver ${t} is not a function`);
		}

		if (this instanceof E == !1) {
			throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
		}

		this._then = [], (function (t, e) {
			function n(t) {
				w(e, t);
			}

			try {
				t(t => {
					b(e, t);
				}, n);
			} catch (t) {
				n(t);
			}
		})(t, this);
	}

	E.prototype = {
		constructor: E,
		_state: 'pending',
		_then: null,
		_data: void 0,
		_handled: !1,
		then(t, e) {
			const n = {
				owner: this, then: new this.constructor(s), fulfilled: t, rejected: e,
			}; return !e && !t || this._handled || (this._handled = !0, this._state === 'rejected' && d && p(j, this)), this._state === 'fulfilled' || this._state === 'rejected' ? p(v, n) : this._then.push(n), n.then;
		},
		catch(t) {
			return this.then(null, t);
		},
	}, E.all = function (t) {
		if (!Array.isArray(t)) {
			throw new TypeError('You must pass an array to Promise.all().');
		}

		return new E((e, n) => {
			const o = []; let r = 0; function i(t) {
				return r++, function (n) {
					o[t] = n, --r || e(o);
				};
			}

			for (var c, a = 0; a < t.length; a++) {
				(c = t[a]) && typeof c.then === 'function' ? c.then(i(a), n) : o[a] = c;
			}

			r || e(o);
		});
	}, E.race = function (t) {
		if (!Array.isArray(t)) {
			throw new TypeError('You must pass an array to Promise.race().');
		}

		return new E((e, n) => {
			for (var o, r = 0; r < t.length; r++) {
				(o = t[r]) && typeof o.then === 'function' ? o.then(e, n) : e(o);
			}
		});
	}, E.resolve = function (e) {
		return e && t(e) === 'object' && e.constructor === E ? e : new E(t => {
			t(e);
		});
	}, E.reject = function (t) {
		return new E((e, n) => {
			n(t);
		});
	};

	const _ = typeof Promise === 'function' ? Promise : E; function F(t, e) {
		const n = e.fetch; const o = e.XMLHttpRequest; const r = e.token; let i = t; return 'URLSearchParams' in window ? (i = new URL(t)).searchParams.set('token', r) : i = `${i}?token=${encodeURIComponent(r)}`, i = i.toString(), new _((t, e) => {
			if (typeof n === 'function') {
				n(i, {mode: 'cors', cache: 'default'}).then(t => {
					if (t.ok) {
						return t.text();
					}

					throw new Error('');
				}).then(e => {
					t(e);
				}).catch(e);
			} else if (typeof o === 'function') {
				const r = new o(); r.addEventListener('loadend', function () {
					this.responseText ? t(this.responseText) : e(new Error(''));
				}); ['abort', 'error', 'timeout'].map(t => {
					r.addEventListener(t, () => {
						e(new Error(''));
					});
				}), r.open('GET', i), r.send();
			} else {
				e(new Error(''));
			}
		});
	}

	function P(t, e, n) {
		let o = t; return [[/(url\("?)\.\.\/\.\.\/\.\./g, function (t, n) {
			return ''.concat(n).concat(e);
		}], [/(url\("?)\.\.\/webfonts/g, function (t, o) {
			return ''.concat(o).concat(e, '/releases/v').concat(n, '/webfonts');
		}], [/(url\("?)https:\/\/kit-free([^.])*\.fontawesome\.com/g, function (t, n) {
			return ''.concat(n).concat(e);
		}]].forEach(t => {
			const e = r(t, 2); const n = e[0]; const i = e[1]; o = o.replace(n, i);
		}), o;
	}

	function C(t, e) {
		const n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function () {}; var r = e.document || r; const i = u.bind(u, r, ['fa', 'fab', 'fas', 'far', 'fal', 'fad', 'fak']); const f = Object.keys(t.iconUploads || {}).length > 0; t.autoA11y.enabled && n(i); const s = [{id: 'fa-main', addOn: void 0}]; t.v4shim && t.v4shim.enabled && s.push({id: 'fa-v4-shims', addOn: '-v4-shims'}), t.v5FontFaceShim && t.v5FontFaceShim.enabled && s.push({id: 'fa-v5-font-face', addOn: '-v5-font-face'}), t.v4FontFaceShim && t.v4FontFaceShim.enabled && s.push({id: 'fa-v4-font-face', addOn: '-v4-font-face'}), f && s.push({id: 'fa-kit-upload', customCss: !0}); const d = s.map(n => new _((r, i) => {
			F(n.customCss ? a(t) : c(t, {addOn: n.addOn, minify: t.minify.enabled}), e).then(i => {
				r(U(i, o(o({}, e), {}, {
					baseUrl: t.baseUrl, version: t.version, id: n.id, contentFilter(t, e) {
						return P(t, e.baseUrl, e.version);
					},
				})));
			}).catch(i);
		})); return _.all(d);
	}

	function U(t, e) {
		const n = e.contentFilter || function (t, e) {
			return t;
		};

		const o = document.createElement('style'); const r = document.createTextNode(n(t, e)); return o.appendChild(r), o.media = 'all', e.id && o.setAttribute('id', e.id), e && e.detectingConflicts && e.detectionIgnoreAttr && o.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), o;
	}

	function k(t, e) {
		e.autoA11y = t.autoA11y.enabled, t.license === 'pro' && (e.autoFetchSvg = !0, e.fetchSvgFrom = `${t.baseUrl}/releases/${t.version === 'latest' ? 'latest' : 'v'.concat(t.version)}/svgs`, e.fetchUploadedSvgFrom = t.uploadsUrl); const n = []; return t.v4shim.enabled && n.push(new _((n, r) => {
			F(c(t, {addOn: '-v4-shims', minify: t.minify.enabled}), e).then(t => {
				n(I(t, o(o({}, e), {}, {id: 'fa-v4-shims'})));
			}).catch(r);
		})), n.push(new _((n, r) => {
			F(c(t, {minify: t.minify.enabled}), e).then(t => {
				const r = I(t, o(o({}, e), {}, {id: 'fa-main'})); n((function (t, e) {
					const n = e && void 0 !== e.autoFetchSvg ? e.autoFetchSvg : void 0; const o = e && void 0 !== e.autoA11y ? e.autoA11y : void 0; void 0 !== o && t.setAttribute('data-auto-a11y', o ? 'true' : 'false'); n && (t.setAttributeNode(document.createAttribute('data-auto-fetch-svg')), t.setAttribute('data-fetch-svg-from', e.fetchSvgFrom), t.setAttribute('data-fetch-uploaded-svg-from', e.fetchUploadedSvgFrom)); return t;
				})(r, e));
			}).catch(r);
		})), _.all(n);
	}

	function I(t, e) {
		const n = document.createElement('SCRIPT'); const o = document.createTextNode(t); return n.appendChild(o), n.referrerPolicy = 'strict-origin', e.id && n.setAttribute('id', e.id), e && e.detectingConflicts && e.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), n;
	}

	function L(t) {
		let e; const n = []; const o = document; const r = o.documentElement.doScroll; let i = (r ? /^loaded|^c/ : /^loaded|^i|^c/).test(o.readyState); i || o.addEventListener('DOMContentLoaded', e = function () {
			for (o.removeEventListener('DOMContentLoaded', e), i = 1; e = n.shift();) {
				e();
			}
		}), i ? setTimeout(t, 0) : n.push(t);
	}

	function T(t) {
		typeof MutationObserver !== 'undefined' && new MutationObserver(t).observe(document, {childList: !0, subtree: !0});
	}

	try {
		if (window.FontAwesomeKitConfig) {
			const x = window.FontAwesomeKitConfig; const M = {
				detectingConflicts: x.detectConflictsUntil && new Date() <= new Date(x.detectConflictsUntil), detectionIgnoreAttr: 'data-fa-detection-ignore', fetch: window.fetch, token: x.token, XMLHttpRequest: window.XMLHttpRequest, document,
			}; const D = document.currentScript; const N = D ? D.parentElement : document.head; (function () {
				const t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; const e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return t.method === 'js' ? k(t, e) : t.method === 'css' ? C(t, e, t => {
					L(t), T(t);
				}) : void 0;
			})(x, M).then(t => {
				t.map(t => {
					try {
						N.insertBefore(t, D ? D.nextSibling : null);
					} catch (e) {
						N.appendChild(t);
					}
				}), M.detectingConflicts && D && L(() => {
					D.setAttributeNode(document.createAttribute(M.detectionIgnoreAttr)); const t = (function (t, e) {
						const n = document.createElement('script'); return e && e.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), n.src = c(t, {
							baseFilename: 'conflict-detection', fileSuffix: 'js', subdir: 'js', minify: t.minify.enabled,
						}), n;
					})(x, M); document.body.appendChild(t);
				});
			}).catch(t => {
				console.error(''.concat('Font Awesome Kit:', ' ').concat(t));
			});
		}
	} catch (t) {
		console.error(''.concat('Font Awesome Kit:', ' ').concat(t));
	}
});
