'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import NewsCard from './NewsCard'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function NewsSlider({ noticias }) {
  if (!noticias || noticias.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" py={4}>
        No hay noticias disponibles.
      </Typography>
    )
  }

  return (
    <Box sx={{ position: 'relative', px: { xs: 0, md: 5 } }}>
      {/* Custom Navigation Buttons */}
      <IconButton
        className="news-swiper-prev"
        sx={{
          position: 'absolute',
          left: { xs: -5, md: -20 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          bgcolor: 'white',
          boxShadow: 2,
          width: 44,
          height: 44,
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'white',
          },
          display: { xs: 'none', sm: 'flex' },
        }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>

      <IconButton
        className="news-swiper-next"
        sx={{
          position: 'absolute',
          right: { xs: -5, md: -20 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          bgcolor: 'white',
          boxShadow: 2,
          width: 44,
          height: 44,
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'white',
          },
          display: { xs: 'none', sm: 'flex' },
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          prevEl: '.news-swiper-prev',
          nextEl: '.news-swiper-next',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        style={{ paddingBottom: 50 }}
      >
        {noticias.slice(0, 6).map((noticia) => (
          <SwiperSlide key={noticia.id}>
            <Box sx={{ height: '100%', pb: 1 }}>
              <NewsCard noticia={noticia} />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #CBD5E1;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #0D5BA8;
        }
      `}</style>
    </Box>
  )
}
