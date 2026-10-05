export const shifts = [
 {code:'M',name:'Ca S?ng',time:'06:00?14:00',hours:8},
 {code:'E',name:'Ca Chi?u',time:'14:00?22:00',hours:8},
 {code:'N',name:'Ca ??m',time:'22:00?06:00',hours:8},
 {code:'S',name:'Ca G?y',time:'10?14 & 18?22',hours:8},
 {code:'OFF',name:'Ngh? tu?n',time:'OFF',hours:0},
 {code:'AL',name:'Ph?p n?m',time:'AL',hours:0},
 {code:'SL',name:'Ngh? ?m',time:'SL',hours:0},
];
export function shiftCode(value:unknown){const text=String(value);return shifts.find(s=>s.time===text||s.code===text)?.code || (text.startsWith('06:')?'M':text.startsWith('14:')?'E':text.startsWith('22:')?'N':'?');}
export function dateKey(d:Date){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
export function weekDays(offset=0){const monday=new Date();monday.setHours(12,0,0,0);monday.setDate(monday.getDate()-((monday.getDay()+6)%7)+offset*7);return Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(d.getDate()+i);return {date:dateKey(d),label:['T2','T3','T4','T5','T6','T7','CN'][i],day:d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'})};});}
