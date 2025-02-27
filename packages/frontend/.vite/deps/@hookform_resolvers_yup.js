import {
  appendErrors,
  get,
  set
} from "./chunk-3CG2VKZS.js";
import "./chunk-W5HLEESS.js";
import "./chunk-DC5AMYBS.js";

// ../../node_modules/@hookform/resolvers/dist/resolvers.mjs
var s = (t, s2, o3) => {
  if (t && "reportValidity" in t) {
    const r2 = get(o3, s2);
    t.setCustomValidity(r2 && r2.message || ""), t.reportValidity();
  }
};
var o = (e, t) => {
  for (const o3 in t.fields) {
    const r2 = t.fields[o3];
    r2 && r2.ref && "reportValidity" in r2.ref ? s(r2.ref, o3, e) : r2 && r2.refs && r2.refs.forEach((t2) => s(t2, o3, e));
  }
};
var r = (s2, r2) => {
  r2.shouldUseNativeValidation && o(s2, r2);
  const f = {};
  for (const o3 in s2) {
    const n = get(r2.fields, o3), a = Object.assign(s2[o3] || {}, { ref: n && n.ref });
    if (i(r2.names || Object.keys(s2), o3)) {
      const s3 = Object.assign({}, get(f, o3));
      set(s3, "root", a), set(f, o3, s3);
    } else set(f, o3, a);
  }
  return f;
};
var i = (e, t) => e.some((e2) => e2.match(`^${t}\\.\\d+`));

// ../../node_modules/@hookform/resolvers/yup/dist/yup.mjs
function o2(o3, n, s2) {
  return void 0 === n && (n = {}), void 0 === s2 && (s2 = {}), function(a, i2, c) {
    try {
      return Promise.resolve(function(t, r2) {
        try {
          var u = (n.context && true && console.warn("You should not used the yup options context. Please, use the 'useForm' context object instead"), Promise.resolve(o3["sync" === s2.mode ? "validateSync" : "validate"](a, Object.assign({ abortEarly: false }, n, { context: i2 }))).then(function(t2) {
            return c.shouldUseNativeValidation && o({}, c), { values: s2.raw ? Object.assign({}, a) : t2, errors: {} };
          }));
        } catch (e) {
          return r2(e);
        }
        return u && u.then ? u.then(void 0, r2) : u;
      }(0, function(e) {
        if (!e.inner) throw e;
        return { values: {}, errors: r((o4 = e, n2 = !c.shouldUseNativeValidation && "all" === c.criteriaMode, (o4.inner || []).reduce(function(e2, t) {
          if (e2[t.path] || (e2[t.path] = { message: t.message, type: t.type }), n2) {
            var o5 = e2[t.path].types, s3 = o5 && o5[t.type];
            e2[t.path] = appendErrors(t.path, n2, e2, t.type, s3 ? [].concat(s3, t.message) : t.message);
          }
          return e2;
        }, {})), c) };
        var o4, n2;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
export {
  o2 as yupResolver
};
//# sourceMappingURL=@hookform_resolvers_yup.js.map
