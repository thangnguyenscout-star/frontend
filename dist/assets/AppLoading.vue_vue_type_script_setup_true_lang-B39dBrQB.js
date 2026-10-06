import{T as p,aq as u,Y as d,o as a,c as i,H as c,d as f,F as m,s as y,i as h,f as b}from"./index-Cz9ayOXW.js";var g=`
    .p-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .p-skeleton::after {
        content: '';
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .p-skeleton::after {
        animation-name: p-skeleton-animation-rtl;
    }

    .p-skeleton-circle {
        border-radius: 50%;
    }

    .p-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes p-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes p-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`,k={root:{position:"relative"}},v={root:function(n){var t=n.props;return["p-skeleton p-component",{"p-skeleton-circle":t.shape==="circle","p-skeleton-animation-none":t.animation==="none"}]}},S=p.extend({name:"skeleton",style:g,classes:v,inlineStyles:k}),_={name:"BaseSkeleton",extends:u,props:{shape:{type:String,default:"rectangle"},size:{type:String,default:null},width:{type:String,default:"100%"},height:{type:String,default:"1rem"},borderRadius:{type:String,default:null},animation:{type:String,default:"wave"}},style:S,provide:function(){return{$pcSkeleton:this,$parentInstance:this}}};function o(e){"@babel/helpers - typeof";return o=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},o(e)}function P(e,n,t){return(n=w(n))in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function w(e){var n=$(e,"string");return o(n)=="symbol"?n:n+""}function $(e,n){if(o(e)!="object"||!e)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var r=t.call(e,n);if(o(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(e)}var l={name:"Skeleton",extends:_,inheritAttrs:!1,computed:{containerStyle:function(){return this.size?{width:this.size,height:this.size,borderRadius:this.borderRadius}:{width:this.width,height:this.height,borderRadius:this.borderRadius}},dataP:function(){return d(P({},this.shape,this.shape))}}},x=["data-p"];function z(e,n,t,r,X,s){return a(),i("div",c({class:e.cx("root"),style:[e.sx("root"),s.containerStyle],"aria-hidden":"true"},e.ptmi("root"),{"data-p":s.dataP}),null,16,x)}l.render=z;const R={class:"loading-state","aria-busy":"true"},j=f({__name:"AppLoading",setup(e){return(n,t)=>(a(),i("div",R,[(a(),i(m,null,y(6,r=>h(b(l),{key:r,height:"2.5rem"})),64))]))}});export{j as _};
