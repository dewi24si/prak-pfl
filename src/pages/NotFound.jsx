import ErrorPage from '../components/ErrorPage'

export default function NotFound() {
  return (
    <ErrorPage
      kodeError={404}
      deskripsiError="Halaman yang kamu cari tidak ada atau telah dipindahkan."
      gambarError="https://cdn-icons-png.flaticon.com/512/6195/6195678.png"
    />
  )
}
