import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
  const [userTypeId, setUserTypeId] = useState(null)
  const [storeId, setStoreId] = useState(null)

  const login = useCallback((jwtToken, id, usertype_id, store_id) => {
    setToken(jwtToken)
    setUserId(id)
    setUserTypeId(usertype_id)
    setStoreId(store_id)

    localStorage.setItem(storageName, JSON.stringify({
      userId: id, 
      token: jwtToken,
      userTypeId: usertype_id,
      storeId: store_id,
    }))
  }, [])


  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setUserTypeId(null)
    setStoreId(null)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.token, data.userId, data.userTypeId, data.storeId)
    }
    setReady(true)
  }, [login])


  return { login, logout, token, userId, userTypeId, storeId, ready }
}
