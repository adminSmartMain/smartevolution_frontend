import { useEffect, useState } from "react";

/* import CrossfadeImage from "react-crossfade-image"; */

export default function ImageCarousel() {
  const [curImg, setCurImg] = useState(0);
  const images = [
    "/assets/Ilustración - Creación de Usuario 1.svg",
    "/assets/Ilustración - Creación de Usuario 2.svg",
    "/assets/Ilustración - Creación de Usuario 3.svg",
  ];

  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      if (curImg < 2) {
        setCurImg((img) => img + 1);
      } else {
        setCurImg(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [curImg]);

  return (
    <>
      {/* <CrossfadeImage
        src={images[curImg]}
        duration={500}
        timingFunction={"ease-out"}
      /> */}
    </>
  );
}
