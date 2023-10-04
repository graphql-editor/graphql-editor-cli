/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	PredictCheckoutInput:{

	},
	TeamEnabledFailureStatus: "enum" as const,
	AccountType: "enum" as const,
	VatInput:{

	},
	UpdateProject:{

	},
	Marketplace:{
		projects:{
			sort:"MarketplaceProjectsSortInput"
		}
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
		getAiRespond:{

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
	Namespace:{
		project:{

		},
		projects:{

		}
	},
	PaymentDate: `scalar.PaymentDate` as const,
	StripeCheckoutDataInput:{

	},
	Decimal: `scalar.Decimal` as const,
	NewSource:{

	},
	MarketplaceOps:{
		addProject:{
			opts:"AddProjectInput"
		},
		removeProject:{

		}
	},
	Team:{
		member:{

		},
		members:{

		},
		serviceAccounts:{

		}
	},
	RenameFileInput:{

	},
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
	NpmRegistryPackageInput:{

	},
	MarketplaceProjectsSortInput:{
		owner:"SortOrder",
		public:"SortOrder",
		slug:"SortOrder",
		tags:"SortOrder",
		team:"SortOrder",
		createdAt:"SortOrder",
		name:"SortOrder",
		id:"SortOrder"
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
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	MemberOps:{
		update:{
			role:"Role"
		}
	},
	CheckoutDataInput:{
		customer:"CustomerInput",
		vat:"VatInput"
	},
	SortOrder: "enum" as const,
	Project:{
		members:{

		},
		sources:{

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
	CreateServiceAccountInput:{

	},
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
	Role: "enum" as const,
	ChangeSubscriptionInput:{

	},
	RFC3339Date: `scalar.RFC3339Date` as const,
	CustomerInput:{

	},
	AddProjectInput:{
		npmRegistryPackage:"NpmRegistryPackageInput"
	}
}

export const ReturnTypes: Record<string,any> = {
	ServiceAccountApiKey:{
		id:"String",
		key:"String",
		name:"String"
	},
	MarketplaceItem:{
		project:"Project",
		upstream:"MarketplaceUpstream"
	},
	SubscriptionConnection:{
		pageInfo:"PageInfo",
		subscriptions:"Subscription"
	},
	Member:{
		email:"String",
		role:"Role",
		serviceAccount:"Boolean",
		username:"String"
	},
	Payment:{
		amount:"Decimal",
		currency:"String",
		date:"PaymentDate",
		receiptURL:"String",
		subscriptionID:"Int"
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
	UserConnection:{
		pageInfo:"PageInfo",
		users:"User"
	},
	ProjectConnection:{
		pageInfo:"PageInfo",
		projects:"Project"
	},
	Marketplace:{
		projects:"MarketplaceItemConnection"
	},
	SourceUploadInfo:{
		filename:"String",
		headers:"Header",
		putUrl:"String"
	},
	Query:{
		checkoutData:"String",
		emailVerified:"Boolean",
		exchangeServiceAccountKey:"String",
		fileServerCredentials:"FileServerCredentials",
		findProjects:"ProjectConnection",
		findProjectsByTag:"ProjectConnection",
		generateStripeBillingPortal:"String",
		getAiRespond:"String",
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
	Namespace:{
		project:"Project",
		projects:"ProjectConnection",
		public:"Boolean",
		slug:"String"
	},
	PaymentDate: `scalar.PaymentDate` as const,
	Decimal: `scalar.Decimal` as const,
	NpmRegistryPackage:{
		package:"String",
		registry:"String"
	},
	PredictCheckout:{
		price:"Float",
		trialDays:"Int"
	},
	ServiceAccount:{
		description:"String",
		keys:"ServiceAccountApiKey",
		name:"String",
		tags:"String"
	},
	MarketplaceOps:{
		addProject:"Boolean",
		removeProject:"Boolean"
	},
	Team:{
		enabled:"TeamEnabled",
		id:"ID",
		member:"Member",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		serviceAccounts:"ServiceAccountConnection",
		tokens:"InviteToken"
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
	FakerSource:{
		checksum:"String",
		contents:"String",
		filename:"String",
		getUrl:"String",
		updatedAt:"String"
	},
	ServiceAccountConnection:{
		pageInfo:"PageInfo",
		serviceAccounts:"ServiceAccount"
	},
	TeamConnection:{
		pageInfo:"PageInfo",
		teams:"Team"
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
	Header:{
		key:"String",
		value:"String"
	},
	PageInfo:{
		last:"String",
		limit:"Int",
		next:"Boolean"
	},
	FakerSourceConnection:{
		pageInfo:"PageInfo",
		sources:"FakerSource"
	},
	Endpoint:{
		uri:"String"
	},
	MarketplaceUpstream:{
		"...on NpmRegistryPackage":"NpmRegistryPackage"
	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	MemberOps:{
		delete:"Boolean",
		update:"Boolean"
	},
	TemporaryFile:{
		getUrl:"String",
		putUrl:"String"
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
	MarketplaceItemConnection:{
		pageInfo:"PageInfo",
		projects:"MarketplaceItem"
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
	TeamEnabled:{
		enabled:"Boolean",
		status:"TeamEnabledFailureStatus"
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
	MemberConnection:{
		members:"Member",
		pageInfo:"PageInfo"
	},
	RFC3339Date: `scalar.RFC3339Date` as const
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}