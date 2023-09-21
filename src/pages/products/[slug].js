import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import PromoCard from "src/products/components/PromoCard";
import { supabase } from "supabase";
import SubscriberCard from "src/products/components/SubscriberCard";

export default function ProductPage({ product }) {
  const [productContent, setProductContent] = useState();
  const session = useSession();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    async function getProductContent() {
      const { data: productContent } = await supabaseClient
        .from("product_content")
        .select("*")
        .eq("id", product.product_content_id)
        .single();

      setProductContent(productContent);
    }

    getProductContent();
  }, [product.product_content_id, supabaseClient]);

  return (
    <section className="product-section">
      <article className="product">
        <div className="product-wrap">
          {productContent?.download_url && (
            <a
              download
              className="download-link large-button"
              href={`/assets/${productContent.download_url}`}
            >
              <span className="large-button-text">Download</span>
            </a>
          )}
          {productContent?.video_url ? (
            <ReactPlayer url={productContent?.video_url} controls />
          ) : (
            <Image
              width={1000}
              height={300}
              src={`/assets/${product.slug}.png`}
              alt={product.name}
            />
          )}
        </div>

        <section>
          <header>
            <h3>{product.name}</h3>
          </header>
          <section>
            <div>
              <p>{product.description}</p>
            </div>
          </section>
        </section>

        <section>{session ? <SubscriberCard /> : <PromoCard />}</section>
      </article>
    </section>
  );
}

export async function getStaticPaths() {
  const { data: products } = await supabase.from("product").select("slug");

  const paths = products.map((product) => ({
    params: {
      slug: product.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;

  let { data: product } = await supabase.from("product").select("*").eq("slug", slug).single();

  return {
    props: { product },
  };
}
