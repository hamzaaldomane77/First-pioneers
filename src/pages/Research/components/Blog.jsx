import { ArrowRight, ArrowLeft } from "lucide-react";
import React from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { getBlogs } from "../../../services/api";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

export default function Blog() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    initialInView: true
  });

  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ['blogs', i18n.language],
    queryFn: () => getBlogs(3),
    staleTime: 300000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-red-600">{t("blog.error")}</p>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <p>{t("blog.noBlogs")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-3 sm:px-5 py-12 lg:px-0" dir={isRTL ? 'rtl' : 'ltr'}>
      <div ref={ref}>
        <h2 className="text-center text-3xl font-bold text-[#BB2632] mb-2 py-9">
          {t("blog.stayInformed")}
        </h2>
      
        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
          {blogs.map((blog, index) => (
            <article
              key={blog.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-20"
              }`}
              style={{
                transitionDelay: `${index * 200}ms`
              }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <div className="relative h-64 md:h-full">
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = t("blog.placeholderImage");
                      }}
                    />
                  </div>
                </div>

                <div className="md:w-2/3 p-6 flex flex-col">
                  {blog.categories && blog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.categories.map((category, index) => (
                        <span
                          key={index}
                          className="text-sm text-[#BB2632] font-medium bg-red-50 px-3 py-1 rounded-full bahnschrift text-[16px]"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-3 pt-3">
                    {blog.title}
                  </h3>

                  <div className="text-sm text-gray-600 mb-4">
                    {blog.author_name && (
                      <span className="block font-medium text-gray-800">{blog.author_name}</span>
                    )}
                    {blog.author_position && (
                      <span className="block text-gray-500 mt-1">{blog.author_position}</span>
                    )}
                  </div>

                  {blog.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3  bahnschrift text-[16px]">
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="mt-auto text-end">
                    <Link
                      to={`/Blogdetails/${blog.slug}`}
                      className="inline-flex items-center text-[#BB2632] font-semibold hover:opacity-80 transition-opacity duration-300"
                    >
                      {t("blog.viewarticle")}
                      {isRTL ? (
                        <ArrowLeft className="w-5 h-5 ml-2" />
                      ) : (
                        <ArrowRight className="w-5 h-5 ml-2" />
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="flex justify-center items-center py-12 text-xl">
          <Link 
            to="/AllBlog" 
            className="inline-flex items-center text-[#ec3a49] font-semibold hover:opacity-80 transition-opacity duration-300 text-center group"
          > 
            {t("blog.filterOptions.viewAllBlogs")}
            {isRTL ? (
              <ArrowLeft className="w-6 h-6 ml-2 transition-transform duration-300" />
            ) : (
              <ArrowRight className="w-6 h-6 ml-2 transition-transform duration-300" />
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}
