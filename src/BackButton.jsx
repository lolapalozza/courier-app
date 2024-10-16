import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const BackButton = ({linkTo, onClick}) => {

  const navigate = useNavigate()

  useEffect(() => {
    onClick ? showBackButton(onClick) : showBackButton(() => {
      navigate(linkTo || "/")
    })
    return hideBackButton
  }, [navigate, linkTo, onClick]);

  return <></>
}

export const showBackButton = (callback) => {
  window.Telegram?.WebApp?.BackButton?.onClick(callback);
  window.Telegram?.WebApp?.BackButton?.show()
}

export const hideBackButton = () => {
  window.Telegram?.WebApp?.BackButton?.hide()
}
