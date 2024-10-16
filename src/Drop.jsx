import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteDrop, getDropById} from "./api.js";
import {BackButton} from "./BackButton.jsx";

export const Drop = ({}) => {

  const navigate = useNavigate()
  const [drop, setDrop] = useState({})
  const { id } = useParams();

  const onDeleteDrop = () => {
    if(confirm("Вы Уверены?")){
      deleteDrop(id).then(() => {
        navigate("/")
      })
    }
  }

  useEffect(() => {
    getDropById(id).then((data) => {
      setDrop(data)
    })
  }, [id])

  return <div style={{textAlign: "center"}}>
    <h3>Клад</h3>

    <BackButton linkTo="/" />

    {
      drop.id && <div
            style={{display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", alignItems: "center"}}>

          <div>{drop.packages.product.short_description}</div>

          <div>{drop.packages.quantity} {drop.packages.product.measure}</div>

          <div>Comment: {drop.comment}</div>

          <div>{drop.district.city.city}</div>

          <div>{drop.district.district}</div>

          <div>
            <button onClick={onDeleteDrop} style={{
              background: "red",
              padding: "12px",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "18px",
              fontWeight: "bold"
            }}>Удалить
            </button>
          </div>

          {
            drop.photos.split(",").map(photo => <img style={{width: "50%"}} key={photo} className="mb-2"
                                                     src={`${process.env.REACT_APP_API_URL}/photos/${photo}`}/>)
          }

        </div>
    }

  </div>
}
