import Slide from '@/components/Slide';
import Starry from '@/components/StarrySky';
import Container from '@/components/Container';
import ArticleLayout from '@/components/ArticleLayout';
import Sidebar from '@/components/Sidebar';

interface Props {
  searchParams: Promise<{ page: number }>;
}

export default async (props: Props) => {
  const searchParams = await props.searchParams;
  const page = searchParams.page ?? 1;

  return (
    <>

      <Slide showMeteors>
        {/* 星空背景组件 */}
        <Starry />
      </Slide>

      <Container>
        {/* 文章列表 */}
        <ArticleLayout page={page} />
        {/* 侧边栏 */}
        <Sidebar />
      </Container>
    </>
  );
};
