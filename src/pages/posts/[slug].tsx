import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import Header from "next/head"

import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../services/prismic"

import styles from "./post.module.scss"

interface PostProps {
    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string    
    }
}

export default function Post ({post}: PostProps) {
    return(
        <>
            <Header>
                <title>{post.title} | IgNews</title>
            </Header>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.content}} />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {

    const session = await getSession({req})

    const { slug } = params

    const prismic = getPrismicClient(req)

    const response = await prismic.getByUID("post_normal", String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long", 
            year: "numeric"
        })
    }

    return { 
        props: {post}
    }

}