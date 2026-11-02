function i(o,r,a,l){const s=t=>{let e=String(t??"");return/^[=+@\-\t\r]/.test(e)&&(e="'"+e),'"'+e.replaceAll('"','""')+'"'},p="\uFEFF"+[a,...o.map(t=>r.map(e=>t[e]))].map(t=>t.map(s).join(",")).join(`\r
`),n=URL.createObjectURL(new Blob([p],{type:"text/csv;charset=utf-8;"})),c=document.createElement("a");c.href=n,c.download=l+".csv",c.click(),URL.revokeObjectURL(n)}export{i as e};
