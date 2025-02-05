package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.61

import (
	"context"
	"errors"
	"os"
	"time"
	"triparta/graph/model"

	"github.com/golang-jwt/jwt/v5"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// LoginUser is the resolver for the loginUser field.
func (r *mutationResolver) LoginUser(ctx context.Context, input model.LoginRequest) (*model.AuthPayload, error) {

	var user model.User
	err := r.ColHelper(r.Db, "users").FindOne(ctx, bson.M{"email": input.Email}).Decode(&user)
	if err != nil {
		log.Error().Err(err).Msg("Failed to find user")
		return nil, errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		log.Error().Err(err).Msg("Invalid password")
		return nil, errors.New("invalid credentials")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.UserID,
		"exp": time.Now().Add(time.Hour * 24).Unix(), // Token valid for 24 hours
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		log.Error().Err(err).Msg("Failed to sign token")
		return nil, errors.New("could not generate token")
	}

	return &model.AuthPayload{Token: tokenString}, nil

}

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (*model.User, error) {

	var user model.User
	err := r.ColHelper(r.Db, "users").FindOne(ctx, bson.M{"email": input.Email}).Decode(&user)
	if err != nil && !errors.Is(err, mongo.ErrNoDocuments) {
		log.Error().Err(err).Send()
		return nil, errors.New("something went wrong")
	}

	if user.Email != "" {
		return nil, errors.New("user already exists")

	}

	newPass, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	input.Password = string(newPass)

	res, err := r.ColHelper(r.Db, "users").InsertOne(ctx, input)
	if err != nil {
		return nil, err
	}

	modelUser := &model.User{
		UserID: res.InsertedID.(primitive.ObjectID).String(),
		Name:   input.Name,
		Email:  input.Email,
	}

	return modelUser, nil
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, id string, input model.UpdateUser) (*model.User, error) {
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Error().Err(err).Send()
		return nil, err
	}

	update := bson.M{
		"name":  input.Name,
		"email": input.Email,
	}

	if input.Password != nil {
		newPass, err := bcrypt.GenerateFromPassword([]byte(*input.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Error().Err(err).Send()
			return nil, err
		}

		update["password"] = string(newPass)
	}

	var updatedUser *model.User

	err = r.ColHelper(r.Db, "users").FindOneAndUpdate(ctx, bson.M{"_id": objId}, bson.M{"$set": update}).Decode(&updatedUser)
	if err != nil {
		log.Error().Err(err).Send()
		return nil, err
	}

	return updatedUser, nil
}

// DeleteUser is the resolver for the deleteUser field.
func (r *mutationResolver) DeleteUser(ctx context.Context, id string) (bool, error) {
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Error().Err(err).Send()
		return false, err
	}

	res, err := r.ColHelper(r.Db, "users").DeleteOne(ctx, bson.M{"_id": objId})
	if err != nil {
		log.Error().Err(err).Send()
		return false, err
	}

	if res.DeletedCount == 0 {
		return false, errors.New("user not found")
	}

	return res.DeletedCount > 0, nil
}

// CreateProduct is the resolver for the createProduct field.
func (r *mutationResolver) CreateProduct(ctx context.Context, input model.NewProduct) (*model.Product, error) {
	res, err := r.ColHelper(r.Db, "products").InsertOne(ctx, input)

	if err != nil {
		return nil, err
	}

	modelProduct := &model.Product{
		ProductID:    res.InsertedID.(primitive.ObjectID).String(),
		ProductName:  input.ProductName,
		ProductPrice: input.ProductPrice,
		ProductStock: input.ProductStock,
	}

	return modelProduct, nil
}

// UpdateProduct is the resolver for the updateProduct field.
func (r *mutationResolver) UpdateProduct(ctx context.Context, id string, input model.NewProduct) (bool, error) {
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Error().Err(err).Send()
		return false, err
	}

	update := bson.M{
		"product_name":  input.ProductName,
		"product_price": input.ProductPrice,
		"product_stock": input.ProductStock,
	}

	var updatedProduct *model.Product

	err = r.ColHelper(r.Db, "products").FindOneAndUpdate(ctx, bson.M{"_id": objId}, bson.M{"$set": update}).Decode(&updatedProduct)
	if err != nil {
		log.Error().Err(err).Send()
		return false, err
	}

	return updatedProduct.ProductID != "", nil
}

// DeleteProduct is the resolver for the deleteProduct field.
func (r *mutationResolver) DeleteProduct(ctx context.Context, id string) (bool, error) {
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Error().Err(err).Send()
		return false, err
	}

	res, err := r.ColHelper(r.Db, "products").DeleteOne(ctx, bson.M{"_id": objId})
	if err != nil {
		log.Error().Err(err).Send()
		return false, err
	}

	if res.DeletedCount == 0 {
		return false, errors.New("product not found")
	}

	return res.DeletedCount > 0, nil
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	res, err := r.ColHelper(r.Db, "users").Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}

	var users []*model.User
	for res.Next(ctx) {
		var user model.User
		err := res.Decode(&user)
		if err != nil {
			return nil, err
		}

		user.Password = ""
		users = append(users, &user)
	}

	return users, nil
}

// Products is the resolver for the products field.
func (r *queryResolver) Products(ctx context.Context) ([]*model.Product, error) {
	res, err := r.ColHelper(r.Db, "products").Find(ctx, bson.D{})
	if err != nil {
		log.Error().Err(err).Send()
		return nil, err
	}

	var products []*model.Product
	for res.Next(ctx) {
		var product model.Product
		err := res.Decode(&product)
		if err != nil {
			log.Error().Err(err).Send()
			return nil, err
		}
		products = append(products, &product)
	}

	return products, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
