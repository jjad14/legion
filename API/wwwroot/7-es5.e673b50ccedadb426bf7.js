function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{jcJX:function(e,t,n){"use strict";n.r(t),n.d(t,"AccountModule",(function(){return j}));var r,i=n("ofXK"),o=n("3Pt+"),s=n("fXoL"),a=n("2rwd"),c=n("tyNb"),l=n("gA0Q"),u=((r=function(){function e(t,n,r){_classCallCheck(this,e),this.accountService=t,this.router=n,this.activatedRoute=r}return _createClass(e,[{key:"ngOnInit",value:function(){this.returnUrl=this.activatedRoute.snapshot.queryParams.returnUrl||"/shop",this.createLoginForm()}},{key:"createLoginForm",value:function(){this.loginForm=new o.e({email:new o.c(null,[o.s.required,o.s.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),password:new o.c(null,o.s.required)})}},{key:"onSubmit",value:function(){var e=this;this.accountService.login(this.loginForm.value).subscribe((function(){e.router.navigateByUrl(e.returnUrl)}),(function(e){console.log(e)}))}}]),e}()).\u0275fac=function(e){return new(e||r)(s.Nb(a.a),s.Nb(c.c),s.Nb(c.a))},r.\u0275cmp=s.Hb({type:r,selectors:[["app-login"]],decls:10,vars:5,consts:[[1,"d-flex","justify-content-center","mt-5"],[1,"col-md-4","col-sm-12"],[3,"formGroup","ngSubmit"],[1,"text-center","mb-4"],[1,"h3","mb-3","font-weight-normal"],["formControlName","email",3,"label"],["formControlName","password",3,"label","type"],["type","submit",1,"btn","btn-md","btn-success","btn-block",3,"disabled"]],template:function(e,t){1&e&&(s.Tb(0,"div",0),s.Tb(1,"div",1),s.Tb(2,"form",2),s.bc("ngSubmit",(function(){return t.onSubmit()})),s.Tb(3,"div",3),s.Tb(4,"h1",4),s.Cc(5,"Login"),s.Sb(),s.Sb(),s.Ob(6,"app-text-input",5),s.Ob(7,"app-text-input",6),s.Tb(8,"button",7),s.Cc(9,"Sign in"),s.Sb(),s.Sb(),s.Sb(),s.Sb()),2&e&&(s.Bb(2),s.jc("formGroup",t.loginForm),s.Bb(4),s.jc("label","Email Address"),s.Bb(1),s.jc("label","Password")("type","password"),s.Bb(1),s.jc("disabled",t.loginForm.invalid))},directives:[o.u,o.l,o.f,l.a,o.k,o.d],styles:[""]}),r),b=n("PqYM"),m=n("LRne"),f=n("eIep"),p=n("lJxs");function d(e,t){if(1&e&&(s.Tb(0,"li"),s.Cc(1),s.Sb()),2&e){var n=t.$implicit;s.Bb(1),s.Ec(" ",n," ")}}function g(e,t){if(1&e&&(s.Tb(0,"ul",10),s.Ac(1,d,2,1,"li",11),s.Sb()),2&e){var n=s.dc();s.Bb(1),s.jc("ngForOf",n.errors)}}var h,v,y,w=[{path:"login",component:u},{path:"register",component:(h=function(){function e(t,n,r){_classCallCheck(this,e),this.fb=t,this.accountService=n,this.router=r}return _createClass(e,[{key:"ngOnInit",value:function(){this.createRegisterForm()}},{key:"createRegisterForm",value:function(){this.registerForm=this.fb.group({displayName:[null,[o.s.required]],email:[null,[o.s.required,o.s.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")],[this.validateEmailAddress()]],password:[null,[o.s.required]]})}},{key:"validateEmailAddress",value:function(){var e=this;return function(t){return Object(b.a)(500).pipe(Object(f.a)((function(){return t.value?e.accountService.checkEmailExists(t.value).pipe(Object(p.a)((function(e){return e?{emailExists:!0}:null}))):Object(m.a)(null)})))}}},{key:"onSubmit",value:function(){var e=this;this.accountService.register(this.registerForm.value).subscribe((function(t){e.router.navigateByUrl("/shop")}),(function(t){console.log(t),e.errors=t.errors}))}}]),e}(),h.\u0275fac=function(e){return new(e||h)(s.Nb(o.b),s.Nb(a.a),s.Nb(c.c))},h.\u0275cmp=s.Hb({type:h,selectors:[["app-register"]],decls:12,vars:7,consts:[[1,"d-flex","justify-content-center","mt-5"],[1,"col-md-4","col-sm-12"],[3,"formGroup","ngSubmit"],[1,"text-center","mb-4"],[1,"h3","mb-3","font-weight-normal"],["formControlName","displayName",3,"label"],["formControlName","email",3,"label"],["formControlName","password",3,"label","type"],["class","text-danger list-unstyled",4,"ngIf"],["type","submit",1,"btn","btn-md","btn-success","btn-block",3,"disabled"],[1,"text-danger","list-unstyled"],[4,"ngFor","ngForOf"]],template:function(e,t){1&e&&(s.Tb(0,"div",0),s.Tb(1,"div",1),s.Tb(2,"form",2),s.bc("ngSubmit",(function(){return t.onSubmit()})),s.Tb(3,"div",3),s.Tb(4,"h1",4),s.Cc(5,"Register"),s.Sb(),s.Sb(),s.Ob(6,"app-text-input",5),s.Ob(7,"app-text-input",6),s.Ob(8,"app-text-input",7),s.Ac(9,g,2,1,"ul",8),s.Tb(10,"button",9),s.Cc(11,"Register"),s.Sb(),s.Sb(),s.Sb(),s.Sb()),2&e&&(s.Bb(2),s.jc("formGroup",t.registerForm),s.Bb(4),s.jc("label","Display Name"),s.Bb(1),s.jc("label","Email Address"),s.Bb(1),s.jc("label","Password")("type","password"),s.Bb(1),s.jc("ngIf",t.errors),s.Bb(1),s.jc("disabled",t.registerForm.invalid))},directives:[o.u,o.l,o.f,l.a,o.k,o.d,i.m,i.l],styles:[""]}),h)}],S=((v=function e(){_classCallCheck(this,e)}).\u0275mod=s.Lb({type:v}),v.\u0275inj=s.Kb({factory:function(e){return new(e||v)},imports:[[i.c,c.g.forChild(w)],c.g]}),v),C=n("PCNd"),j=((y=function e(){_classCallCheck(this,e)}).\u0275mod=s.Lb({type:y}),y.\u0275inj=s.Kb({factory:function(e){return new(e||y)},imports:[[i.c,C.a,S]]}),y)}}]);