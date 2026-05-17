import React from 'react'
import { BlobDiv } from "../styles/blobStyles.js"
import { motion, useScroll, useTransform } from 'motion/react'

const Blob = () => {
    const {scrollY} = useScroll()

    const yText = useTransform(scrollY, [0, 600], [0, -150]);
    const yImage = useTransform(scrollY, [0, 600], [0, 150]);
  return (

    // <motion.div
    //   style={{ y: yText }}>
    //   <BlobDiv id='blob' className='scale'></BlobDiv>
    // </motion.div>
      <BlobDiv id='blob' className='scale'></BlobDiv>

  )
}

export default Blob