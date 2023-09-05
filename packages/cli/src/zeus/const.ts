/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	MarketplaceProjectsSortInput:{
		name:"SortOrder",
		id:"SortOrder",
		owner:"SortOrder",
		public:"SortOrder",
		slug:"SortOrder",
		tags:"SortOrder",
		team:"SortOrder",
		createdAt:"SortOrder"
	},
	ChangeSubscriptionInput:{

	},
	Project:{
		members:{

		},
		sources:{

		}
	},
	Namespace:{
		project:{

		},
		projects:{

		}
	},
	PaymentDate: `scalar.PaymentDate` as const,
	ProjectsSortInput:{
		name:"SortOrder",
		id:"SortOrder",
		owner:"SortOrder",
		public:"SortOrder",
		slug:"SortOrder",
		tags:"SortOrder",
		team:"SortOrder",
		createdAt:"SortOrder"
	},
	Query:{
		checkoutData:{
			data:"CheckoutDataInput"
		},
		exchangeServiceAccountKey:{

		},
		fileServerCredentials:{

		},
		findProjects:{

		},
		findProjectsByTag:{

		},
		generateStripeBillingPortal:{

		},
		getNamespace:{

		},
		getProject:{

		},
		getTeam:{

		},
		getUser:{

		},
		listProjects:{
			sort:"ProjectsSortInput"
		},
		myTeams:{

		},
		predictCheckout:{
			data:"PredictCheckoutInput"
		},
		stripePaymentLink:{
			data:"StripeCheckoutDataInput"
		}
	},
	NpmRegistryPackageInput:{

	},
	VatInput:{

	},
	RenameFileInput:{

	},
	Decimal: `scalar.Decimal` as const,
	MarketplaceOps:{
		addProject:{
			opts:"AddProjectInput"
		},
		removeProject:{

		}
	},
	Role: "enum" as const,
	Mutation:{
		changePassword:{

		},
		changeSubscription:{
			in:"ChangeSubscriptionInput"
		},
		consumeInviteToken:{

		},
		createTeam:{

		},
		createUser:{

		},
		deployToFaker:{

		},
		removeProject:{

		},
		sync:{

		},
		team:{

		},
		updateProject:{
			in:"UpdateProject"
		},
		updateSources:{
			sources:"NewSource"
		}
	},
	ProjectOps:{
		addMember:{
			role:"Role"
		},
		createTemporaryFile:{

		},
		removeSources:{

		},
		renameSources:{
			files:"RenameFileInput"
		},
		update:{
			in:"UpdateProject"
		}
	},
	Marketplace:{
		projects:{
			sort:"MarketplaceProjectsSortInput"
		}
	},
	MemberOps:{
		update:{
			role:"Role"
		}
	},
	NewSource:{

	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	CustomerInput:{

	},
	AddProjectInput:{
		npmRegistryPackage:"NpmRegistryPackageInput"
	},
	PredictCheckoutInput:{

	},
	StripeCheckoutDataInput:{

	},
	TeamOps:{
		addMember:{
			role:"Role"
		},
		createProject:{

		},
		createServiceAccount:{
			input:"CreateServiceAccountInput"
		},
		createServiceAccountApiKey:{

		},
		inviteToken:{
			role:"Role"
		},
		member:{

		},
		members:{

		},
		project:{

		},
		removeServiceAccount:{

		},
		removeServiceAccountApiKey:{

		},
		removeToken:{

		}
	},
	AccountType: "enum" as const,
	SortOrder: "enum" as const,
	CreateServiceAccountInput:{

	},
	CheckoutDataInput:{
		customer:"CustomerInput",
		vat:"VatInput"
	},
	RFC3339Date: `scalar.RFC3339Date` as const,
	Team:{
		member:{

		},
		members:{

		},
		serviceAccounts:{

		}
	},
	UpdateProject:{

	}
}

export const ReturnTypes: Record<string,any> = {
	FakerSource:{
		checksum:"String",
		contents:"String",
		filename:"String",
		getUrl:"String",
		updatedAt:"String"
	},
	SubscriptionConnection:{
		pageInfo:"PageInfo",
		subscriptions:"Subscription"
	},
	Project:{
		createdAt:"RFC3339Date",
		dbConnection:"String",
		description:"String",
		enabled:"Boolean",
		endpoint:"Endpoint",
		id:"ID",
		inCloud:"Boolean",
		members:"MemberConnection",
		mocked:"Boolean",
		name:"String",
		owner:"User",
		public:"Boolean",
		slug:"String",
		sources:"FakerSourceConnection",
		tags:"String",
		team:"Team",
		updatedAt:"RFC3339Date",
		upstream:"String"
	},
	User:{
		accountType:"AccountType",
		consentGiven:"Boolean",
		consentTimestamp:"Int",
		id:"ID",
		namespace:"Namespace",
		stripeCustomerId:"ID",
		subscriptions:"SubscriptionConnection",
		username:"String"
	},
	Namespace:{
		project:"Project",
		projects:"ProjectConnection",
		public:"Boolean",
		slug:"String"
	},
	InviteToken:{
		createdAt:"String",
		domain:"String",
		expiration:"String",
		name:"String",
		removed:"Boolean",
		role:"Role",
		token:"String"
	},
	TeamConnection:{
		pageInfo:"PageInfo",
		teams:"Team"
	},
	MarketplaceItem:{
		project:"Project",
		upstream:"MarketplaceUpstream"
	},
	PaymentDate: `scalar.PaymentDate` as const,
	ServiceAccountConnection:{
		pageInfo:"PageInfo",
		serviceAccounts:"ServiceAccount"
	},
	Query:{
		checkoutData:"String",
		emailVerified:"Boolean",
		exchangeServiceAccountKey:"String",
		fileServerCredentials:"FileServerCredentials",
		findProjects:"ProjectConnection",
		findProjectsByTag:"ProjectConnection",
		generateStripeBillingPortal:"String",
		getNamespace:"Namespace",
		getProject:"Project",
		getTeam:"Team",
		getUser:"User",
		listProjects:"ProjectConnection",
		marketplace:"Marketplace",
		myTeams:"TeamConnection",
		payments:"Payment",
		predictCheckout:"PredictCheckout",
		stripePaymentLink:"String"
	},
	FakerSourceConnection:{
		pageInfo:"PageInfo",
		sources:"FakerSource"
	},
	PredictCheckout:{
		price:"Float",
		trialDays:"Int"
	},
	Decimal: `scalar.Decimal` as const,
	TemporaryFile:{
		getUrl:"String",
		putUrl:"String"
	},
	MarketplaceItemConnection:{
		pageInfo:"PageInfo",
		projects:"MarketplaceItem"
	},
	MarketplaceOps:{
		addProject:"Boolean",
		removeProject:"Boolean"
	},
	Mutation:{
		changePassword:"Boolean",
		changeSubscription:"Boolean",
		consumeInviteToken:"Boolean",
		createTeam:"TeamOps",
		createUser:"User",
		deleteAccount:"Boolean",
		deployToFaker:"Boolean",
		marketplace:"MarketplaceOps",
		removeProject:"Boolean",
		resendVerificationEmail:"Boolean",
		sync:"Boolean",
		team:"TeamOps",
		updateProject:"Boolean",
		updateSources:"SourceUploadInfo"
	},
	ProjectOps:{
		addMember:"Member",
		createTemporaryFile:"TemporaryFile",
		delete:"Boolean",
		deployToFaker:"Boolean",
		removeSources:"Boolean",
		renameSources:"Boolean",
		update:"Boolean"
	},
	Header:{
		key:"String",
		value:"String"
	},
	Endpoint:{
		uri:"String"
	},
	UserConnection:{
		pageInfo:"PageInfo",
		users:"User"
	},
	ServiceAccountApiKey:{
		id:"String",
		key:"String",
		name:"String"
	},
	Marketplace:{
		projects:"MarketplaceItemConnection"
	},
	MemberOps:{
		delete:"Boolean",
		update:"Boolean"
	},
	MemberConnection:{
		members:"Member",
		pageInfo:"PageInfo"
	},
	Member:{
		email:"String",
		role:"Role",
		serviceAccount:"Boolean",
		username:"String"
	},
	Subscription:{
		cancelURL:"String",
		expiration:"String",
		quantity:"Int",
		seats:"UserConnection",
		status:"String",
		subscriptionID:"Int",
		subscriptionPlanID:"Int",
		updateURL:"String"
	},
	ServiceAccount:{
		description:"String",
		keys:"ServiceAccountApiKey",
		name:"String",
		tags:"String"
	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	NpmRegistryPackage:{
		package:"String",
		registry:"String"
	},
	Payment:{
		amount:"Decimal",
		currency:"String",
		date:"PaymentDate",
		receiptURL:"String",
		subscriptionID:"Int"
	},
	SourceUploadInfo:{
		filename:"String",
		headers:"Header",
		putUrl:"String"
	},
	TeamOps:{
		addMember:"Member",
		createProject:"Project",
		createServiceAccount:"ServiceAccount",
		createServiceAccountApiKey:"ServiceAccountApiKey",
		delete:"Boolean",
		id:"ID",
		inviteToken:"String",
		member:"MemberOps",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		project:"ProjectOps",
		removeServiceAccount:"Boolean",
		removeServiceAccountApiKey:"Boolean",
		removeToken:"String"
	},
	PageInfo:{
		last:"String",
		limit:"Int",
		next:"Boolean"
	},
	ProjectConnection:{
		pageInfo:"PageInfo",
		projects:"Project"
	},
	MarketplaceUpstream:{
		"...on NpmRegistryPackage":"NpmRegistryPackage"
	},
	RFC3339Date: `scalar.RFC3339Date` as const,
	Team:{
		id:"ID",
		member:"Member",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		serviceAccounts:"ServiceAccountConnection",
		tokens:"InviteToken"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}