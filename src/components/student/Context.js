import { Container} from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';


export default function Context(pros) {
    const { context } = pros;
    const gfm = require('remark-gfm')
    return <Container fluid>
        <ReactMarkdown remarkPlugins={[gfm]} rehypePlugins={[rehypeRaw]} children={context}/>
    </Container>
}