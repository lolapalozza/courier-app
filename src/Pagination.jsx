import {useEffect} from "react";

export const Pagination = ({children, pagination, onChange, limit, offset, setLimit, setOffset}) => {

  useEffect(() => {
    onChange({limit, offset})
  }, [limit, offset, onChange])

  return <>
    <div style={{marginBottom: "10px"}}>
      <select className="text-black mb-2 mr-1" value={limit} onChange={(e) => setLimit(+e.target.value)}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>
    {children}
    <div style={{marginTop: "10px", display: "flex", gap: "10px", "alignItems": "baseline"}}>
      {offset > 0 &&
          <button onClick={() => setOffset(offset - +limit)}
                  className="border-2 p-1 border-white">{`<`} назад</button>
      }

      {offset + 1} - {Math.min(offset + limit, pagination?.total)}

      {+limit + offset < pagination?.total &&
          <button onClick={() => setOffset(offset + +limit)}
                  className="border-2 p-1 border-white">вперед {`>`}</button>
      }

      <div style={{marginTop: "10px"}}>
        Всего: {pagination?.total}
      </div>
    </div>
  </>
}
