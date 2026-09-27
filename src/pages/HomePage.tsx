import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, Category, Brand, Banner, ProductReview, FAQItem, HomepageSection } from '../types';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FlashDeals } from '../components/home/FlashDeals';
import { ContractorBulkSection } from '../components/home/ContractorBulkSection';
import {
  BestsellersSection,
  FeaturedHardwareSection,
  BrandsRow,
  WhyChooseUs,
  OrderProcess,
  TestimonialsSection,
  FAQSection
} from '../components/home/HomeSections';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [p, c, b, ban, r, f, s] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getBrands(),
          api.getBanners(),
          api.getReviews(),
          api.getFaqs(),
          api.getHomepageSections()
        ]);
        setProducts(p);
        setCategories(c);
        setBrands(b);
        setBanners(ban);
        setReviews(r);
        setFaqs(f);
        setSections(s);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#124DA6] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-gray-600">Loading Devshree Hardware...</span>
        </div>
      </div>
    );
  }

  // Check section visibility from CMS
  const isEnabled = (sectionId: string) => {
    const s = sections.find(sec => sec.id === sectionId);
    return s ? s.isEnabled : true;
  };

  const getSection = (sectionId: string) => {
    return sections.find(sec => sec.id === sectionId);
  };

  const featuredSec = getSection('featured_products');
  const brandsSec = getSection('brands');
  const reviewsSec = getSection('reviews');

  return (
    <div className="space-y-0">
      {isEnabled('hero') && <HeroCarousel banners={banners} />}
      {isEnabled('categories') && <CategoryGrid categories={categories} />}
      {isEnabled('flash_deals') && <FlashDeals products={products} />}
      {isEnabled('bestsellers') && <BestsellersSection products={products} />}
      {isEnabled('bulk_contractor') && <ContractorBulkSection />}
      {isEnabled('featured_products') && (
        <FeaturedHardwareSection
          products={products}
          title={featuredSec?.title}
          subtitle={featuredSec?.name}
        />
      )}
      {isEnabled('brands') && (
        <BrandsRow
          brands={brands}
          title={brandsSec?.title}
          subtitle={brandsSec?.name}
        />
      )}
      {isEnabled('why_devshree') && <WhyChooseUs />}
      {isEnabled('order_process') && <OrderProcess />}
      {isEnabled('reviews') && (
        <TestimonialsSection
          reviews={reviews.filter(r => r.isApproved !== false)}
          title={reviewsSec?.title}
          subtitle={reviewsSec?.name}
        />
      )}
      {isEnabled('faq') && <FAQSection faqs={faqs} />}
    </div>
  );
};
