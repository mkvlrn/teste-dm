import { PageContainer } from "#/components/page-container/page-container";
import { Login } from "#/pages/login/login";
import { useAuth } from "#/utils/user";

export function Home() {
  const { user } = useAuth();

  return (
    <>
      {!user && <Login />}
      {user?.email && (
        <PageContainer title="aTestamento digital">
          <div className="flex flex-col gap-4 text-xl">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus delectus nostrum
              iusto culpa nesciunt odio sapiente natus. Quo, id quibusdam ipsa consequatur rem,
              corrupti rerum libero, beatae optio accusantium quod?
            </p>
            <p>
              Nam, laudantium accusamus? Nostrum, voluptate cupiditate, ut et ab quod voluptatem
              inventore animi esse quasi at similique distinctio? Quidem nobis totam eos incidunt
              sunt unde placeat hic quis qui non!
            </p>
            <p>
              Veritatis voluptates laboriosam voluptas officia quo sapiente sint atque dignissimos
              amet repellat unde natus velit, quos maiores minus praesentium tempora animi minima
              at? Sunt quas, nesciunt laboriosam eaque consequatur itaque.
            </p>
            <p>
              Repudiandae sunt quos odio, excepturi ad quasi voluptates. Recusandae, ab quae
              molestiae quasi assumenda cumque culpa fugiat laboriosam, deleniti id nihil qui
              pariatur? Repellat quisquam repudiandae id recusandae reiciendis? Necessitatibus!
            </p>
            <p>
              Consequatur non, assumenda fugiat quam autem incidunt corrupti porro dolorem?
              Necessitatibus error tempora assumenda, odit veritatis, non aspernatur quis nihil
              fugiat, sit mollitia? Veritatis, reprehenderit. Voluptatibus veniam accusantium hic
              aut!
            </p>
          </div>
        </PageContainer>
      )}
    </>
  );
}
