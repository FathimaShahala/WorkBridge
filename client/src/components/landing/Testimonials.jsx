import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Kumar",
    role: "Construction Worker",
    image: "https://i.pravatar.cc/150?img=11",
    feedback:
      "WorkBridge helped me find verified job opportunities quickly and securely.",
  },
  {
    name: "Priya Nair",
    role: "HR Manager",
    image: "https://i.pravatar.cc/150?img=5",
    feedback:
      "Recruiting skilled workers is now faster and completely digital.",
  },
  {
    name: "Anoop Das",
    role: "Labour Officer",
    image: "https://i.pravatar.cc/150?img=18",
    feedback:
      "The verification workflow is simple, transparent, and saves significant time.",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Testimonials
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            What People Say
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Trusted by workers, employers, and government officials.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.name}>
              <div className="h-full rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {item.role}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="mt-5 leading-7 text-slate-600">
                  "{item.feedback}"
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;