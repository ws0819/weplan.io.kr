import { Helmet } from "@dr.pogodin/react-helmet"

interface Props{
  title: string,
  description: string,
  keyword:string
}

function SEO({title,description,keyword }:Props) {

  return (
    <Helmet>
      <title>{`${title} | 위플랜`}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={ keyword } />
    </Helmet>
  )
}
export default SEO