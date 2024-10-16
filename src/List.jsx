import {getDrops} from "./api.js";
import {useCallback, useEffect, useState} from "react";
import {Pagination} from "./Pagination.jsx";
import {useNavigate} from "react-router-dom";

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

export const DropsList = ({user}) => {

  const navigate = useNavigate()

  const [drops, setDrops] = useState([])
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [pagination, setPagination] = useState({})

  const updateDropsList = useCallback(({limit, offset}) => {
    if(user.user_id){
      getDrops({limit, offset, userId: user.user_id}).then(({drops, pagination}) => {
        setDrops(drops)
        setPagination(pagination)
      })
    }
  }, [user])

  useEffect(() => {
    if (user.user_id) {
      updateDropsList({ limit, offset });
    }
  }, [user, limit, offset, updateDropsList]);

  const goToDrop = (id) => {
    navigate(`/drop/${id}`)
  }

  return <div>
    <h3>Список Дропов</h3>

    <div className="">
      {drops?.length ? <Pagination pagination={pagination} onChange={updateDropsList} limit={limit} offset={offset} setLimit={setLimit}
                                   setOffset={setOffset}>
        <table className="drops-list">
          <thead>
          <tr>
            <td>Продукт</td>
            <td>Количество</td>
            <td>Коммент</td>
            <td>Дата Заказа</td>
            <td></td>
          </tr>
          </thead>
          <tbody>
          {drops.map((drop) => {
            return <tr key={drop.id} className="border-2 cursor-pointer">
              <td>
                <span>{drop.productTitle}</span>
              </td>
              <td>
                {drop.packageQuantity}
              </td>
              <td>
                {drop.comment}
              </td>
              <td>
                {formatDate(drop.soldAt)}
              </td>
              <td>
                <button onClick={() => goToDrop(drop.id)}>
                  Manage
                </button>
              </td>
            </tr>
          })}
          </tbody>
        </table></Pagination> : <div className="mt-5">
        Кладов не найдено
      </div>}
    </div>

  </div>
}
