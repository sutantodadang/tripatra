package graph

import "go.mongodb.org/mongo-driver/mongo"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Db *mongo.Client
}

func (r *Resolver) ColHelper(db *mongo.Client, collectionName string) *mongo.Collection {

	return db.Database("public").Collection(collectionName)
}
