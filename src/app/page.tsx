import styles from './page.module.css'
import Calendar from '../component/Calendar'
import { db } from '../lib/db'
import { Dayjs } from 'dayjs'
import Auth from '@/component/Auth'
import { auth } from '@/firebase'

type Event = {
  capacity: number,
  content: string,
  date: Dayjs,
  eventDay: string,
  eventTime: string,
  title: string,
  members: number,
  id: string
}
async function getData() {
  let posts: Event[] = []
  try {
    const querySnapshot = await db.collection('events').orderBy('eventTime', 'asc').where("open", "==", true).get();
    querySnapshot.forEach(function (doc) {
      const setmember = doc.data().member.length;
      posts.push({
        capacity: doc.data().capacity,
        content: doc.data().content,
        date: doc.data().date,
        eventDay: doc.data().eventDay,
        eventTime: doc.data().eventTime,
        title: doc.data().title,
        members: setmember,
        id: doc.id,
      })
    })
  } catch (error) {
    alert(`Error getting documents: ${error}`)
  }
  const postsdata = await JSON.parse(JSON.stringify(posts))
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_PROJECT_ID}/databases/(default)/documents/events/`, { cache: 'no-store' })
  const ress  = await res.json()
  return {
    postsdata,
    ress
  }
}

const Home = async () => {
  const eventdata = (await getData()).postsdata
  return (
    <main className={`main ${styles.main}`}>
      <Auth eventdata={eventdata} />
    </main>
  )
}

export default Home