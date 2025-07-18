import { Request, Response } from "express";
import { Webhook } from "svix";
import UserModel from "../models/userModel";
import TransactionModel from "../models/transactionModel";

const webhookController = async (req: Request, res: Response) => {
  try {
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error("Webhook secret not set");
      throw new Error("Webhook secret not set");
    }
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    //verify webhook signature
    await webhook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
    });

    //handle user events
    const { type, data } = req.body;
    switch (type) {
      case "user.created":
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address,
          firstName: data.first_name,
          photo: data.profile_image_url,
        };
        await UserModel.create(userData);
        res.status(201).json({
          success: true,
          message: "User created successfully",
        });
        break;
      case "user.updated":
        const userUpdatedData = {
          email: data.email_addresses[0]?.email_address,
          firstName: data.first_name,
          photo: data.profile_image_url,
        };
        await UserModel.findOneAndUpdate(
          { clerkid: data.id },
          userUpdatedData,
          { runValidators: true }
        );
        res.status(200).json({
          success: true,
          message: "user updated successfully",
        });
        break;
      case "user.deleted":
        const clerkId = data.id;
        const user = await UserModel.findOneAndDelete({ clerkId: clerkId });
        if (user) {
          await TransactionModel.deleteMany({ user: user._id });
          res.status(200).json({
            success: true,
            message: "user deleted successfully",
          });
        } else {
          res.status(404).json({
            success: false,
            message: "user not found or already deleted",
          });
        }
        break;
      default:
        console.warn(`Unhandled event type: ${type}`);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error, please try again",
    });
  }
};

export { webhookController };
