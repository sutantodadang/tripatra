package db

import (
	"context"

	"os"

	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewMongo() *mongo.Client {

	client, err := mongo.Connect(context.Background(), clientOptions())
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect to MongoDB")
	}

	return client
}

func clientOptions() *options.ClientOptions {

	return options.Client().ApplyURI(
		os.Getenv("MONGO_URI"),
	)
}
