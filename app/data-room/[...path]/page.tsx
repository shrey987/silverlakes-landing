import { redirect } from 'next/navigation';

// Redirect nested paths to root data room page — path is handled client-side
export default function DataRoomNestedPage() {
  redirect('/data-room');
}
