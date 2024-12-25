//go:generate go run ./gqlgen.go

package main

import (
	"os"
	"triparta/db"
	"triparta/graph"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	"github.com/vektah/gqlparser/v2/ast"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	_ "github.com/joho/godotenv/autoload"
)

// Defining the Graphql handler
func graphqlHandler(db *mongo.Client) gin.HandlerFunc {
	// NewExecutableSchema and Config are in the generated.go file
	// Resolver is in the resolver.go file
	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		Db: db,
	}}))

	// Server setup:
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	return func(c *gin.Context) {
		srv.ServeHTTP(c.Writer, c.Request)
	}
}

// Defining the Playground handler
func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/query")

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func init() {
	log.Logger = log.With().Caller().Logger()
}

func main() {

	db := db.NewMongo()

	// Setting up Gin
	r := gin.Default()

	r.Use(cors.Default())

	// Serve static files
	r.Static("/", "./webapp/dist")
	r.NoRoute(func(c *gin.Context) {
		// Only return index.html for non-file requests
		c.File("./webapp/dist/index.html")
	})
	r.POST("/query", graphqlHandler(db))
	// r.GET("/playground", playgroundHandler())

	log.Fatal().Err(r.Run(":" + os.Getenv("PORT"))).Msg("Server exited with error")
}
