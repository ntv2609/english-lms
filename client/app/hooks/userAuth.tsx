import { useSelector } from 'react-redux';
export default function userAuth() { return !!useSelector((s: any) => s.auth.user); }